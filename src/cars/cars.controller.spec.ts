import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { Between, IsNull, LessThan } from 'typeorm';
import { format, startOfDay, subMonths } from 'date-fns';
import { DatabaseModule } from '@app/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { CarsRepository } from './cars.repository';
import { OwnersRepository } from './owners.repository';
import { CarSchemaFactory } from './car.schema.factory';
import { OwnerSchemaFactory } from './owner.schema.factory';
import { Car as CarEntity } from './entities/car.entity';
import { Manufacturer as ManufacturerEntity } from './entities/manufacturer.entity';
import { Owner as OwnerEntity } from './entities/owner.entity';
import { Car } from './models/Car';
import { Manufacturer } from './models/Manufacturer';
import { Owner } from './models/Owner';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarCommandHandlers } from './commands';
import { CarQueryHandlers } from './queries';
import { CarEventsHandlers } from './events';
import { CreateCarCommand } from './commands/create-car/create-car.command';
import { UpdateCarCommand } from './commands/update-car/update-car.command';
import { RemoveCarCommand } from './commands/remove-car/remove-car.command';
import { UpdateCarsDataCommand } from './commands/update-cars-data/update-cars-data.command';
import { CarCreatedEvent } from './events/car-created/car-created.event';
import { CarQuery } from './queries/car/car.query';
import { CarsQuery } from './queries/cars/cars.query';
import { CarManufacturerQuery } from './queries/car-manufacturer/car-manufacturer.query';
import { ManufacturersRepository } from './manufacturers.repository';
import { ManufacturerSchemaFactory } from './manufacturer.schema.factory';

const createCarDto: CreateCarDto = {
  price: 1111,
  firstRegistrationDate: new Date(),
  manufacturer: {
    name: 'test',
    phone: '+380000000000',
    siret: '111111111111111',
  },
};

const updateCarDto: UpdateCarDto = {
  price: 2222,
  manufacturer: {
    name: 'test-updated',
    phone: '+380000000000',
    siret: '22222222222222',
  },
};

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

describe('CarsController', () => {
  let module: TestingModule;
  let carsController: CarsController;
  let carsRepository: CarsRepository;
  let ownersRepository: OwnersRepository;
  let manufacturersRepository: ManufacturersRepository;
  let carsService: CarsService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;
  let eventBus: EventBus;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: './.env.test',
          isGlobal: true,
        }),
        CqrsModule,
        DatabaseModule,
        DatabaseModule.forFeature([CarEntity, ManufacturerEntity, OwnerEntity]),
      ],
      controllers: [CarsController],
      providers: [
        CarsService,
        CarsRepository,
        CarSchemaFactory,
        OwnersRepository,
        OwnerSchemaFactory,
        ManufacturersRepository,
        ManufacturerSchemaFactory,
        ...CarCommandHandlers,
        ...CarQueryHandlers,
        ...CarEventsHandlers,
      ],
    }).compile();

    carsController = module.get<CarsController>(CarsController);
    carsService = module.get<CarsService>(CarsService);
    carsRepository = module.get<CarsRepository>(CarsRepository);
    manufacturersRepository = module.get<ManufacturersRepository>(
      ManufacturersRepository,
    );
    ownersRepository = module.get<OwnersRepository>(OwnersRepository);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
    eventBus = module.get<EventBus>(EventBus);
    await module.init();
  });

  it('CarsController should be defined', () => {
    expect(carsController).toBeDefined();
  });

  describe('create', () => {
    describe('When create is called', () => {
      let car: Car;
      let manufacturer: Manufacturer;
      beforeEach(async () => {
        jest.spyOn(carsService, 'create');
        jest.spyOn(commandBus, 'execute');
        jest.spyOn(eventBus, 'publish');
        jest.spyOn(carsRepository, 'create');
        car = await carsController.create(createCarDto);
        manufacturer = new Manufacturer(car.manufacturer);
      });

      it('Should call CarsService', async () => {
        expect(carsService.create).toHaveBeenCalled();
        expect(carsService.create).toHaveBeenCalledWith(createCarDto);
        expect(commandBus.execute).toHaveBeenCalled();
        expect(commandBus.execute).toHaveBeenCalledWith(
          new CreateCarCommand(createCarDto),
        );
        expect(carsRepository.create).toHaveBeenCalledWith(
          new Car(createCarDto),
        );
        expect(eventBus.publish).toHaveBeenCalledWith(
          new CarCreatedEvent(car as unknown as CarEntity),
        );
      });

      it('Should return a car', async () => {
        expect(car.price).toBe(createCarDto.price);
        expect(car.firstRegistrationDate).toBe(
          createCarDto.firstRegistrationDate,
        );
        expect(car.manufacturer.name).toBe(createCarDto.manufacturer.name);
      });

      afterEach(async () => {
        const carModel = await carsRepository.findOneById(car.id);
        await carsRepository.remove(carModel);
        await manufacturersRepository.remove(manufacturer);
      });
    });
  });

  describe('Update', () => {
    describe('When update is called', () => {
      let car: Car;
      let manufacturer: Manufacturer;
      beforeEach(async () => {
        car = await carsService.create(createCarDto);
        manufacturer = new Manufacturer(car.manufacturer);
        jest.spyOn(carsService, 'update');
        jest.spyOn(commandBus, 'execute');
        jest.spyOn(eventBus, 'publish');
        jest.spyOn(carsRepository, 'update');
        await carsController.update(car.id, updateCarDto);
      });

      it('Should call CarsService', async () => {
        expect(carsService.update).toHaveBeenCalled();
        expect(carsService.update).toHaveBeenCalledWith(car.id, updateCarDto);
        expect(commandBus.execute).toHaveBeenCalled();
        expect(commandBus.execute).toHaveBeenCalledWith(
          new UpdateCarCommand(car.id, updateCarDto),
        );
        expect(carsRepository.update).toHaveBeenCalled();
      });

      afterEach(async () => {
        const carModel = await carsRepository.findOneById(car.id);
        await carsRepository.remove(carModel);
        await manufacturersRepository.remove(manufacturer);
      });
    });
  });

  describe('getOne', () => {
    describe('When getOne is called', () => {
      let car: Car;
      let manufacturer: Manufacturer;
      let createdCarId: number;
      beforeEach(async () => {
        jest.spyOn(carsService, 'getOne');
        jest.spyOn(queryBus, 'execute');
        jest.spyOn(carsRepository, 'findOneById');
        const { id: carId, manufacturer: manufacturerData } =
          await carsService.create(createCarDto);
        createdCarId = carId;
        manufacturer = manufacturerData;
        car = await carsController.getOne(carId);
      });

      it('Should call CarsService', async () => {
        expect(carsService.getOne).toHaveBeenCalled();
        expect(carsService.getOne).toHaveBeenCalledWith(car.id);
        expect(queryBus.execute).toHaveBeenCalled();
        expect(queryBus.execute).toHaveBeenCalledWith(new CarQuery(car.id));
        expect(carsRepository.findOneById).toHaveBeenCalled();
        expect(car.id).toBe(createdCarId);
      });

      afterEach(async () => {
        const carModel = await carsRepository.findOneById(createdCarId);
        await carsRepository.remove(carModel);
        await manufacturersRepository.remove(manufacturer);
      });
    });
  });

  describe('getManufacturer', () => {
    describe('When getManufacturer is called', () => {
      let manufacturer: Manufacturer;
      let manufacturerCreated: Manufacturer;
      let createdCarId: number;
      beforeEach(async () => {
        const { id: carId, manufacturer: manufacturerData } =
          await carsService.create(createCarDto);
        createdCarId = carId;
        manufacturerCreated = manufacturerData;
        jest.spyOn(carsService, 'getManufacturer');
        jest.spyOn(queryBus, 'execute');
        jest.spyOn(carsRepository, 'findOneById');
        manufacturer = await carsController.getManufacturer(createdCarId);
      });

      it('Should call CarsService', async () => {
        expect(carsService.getManufacturer).toHaveBeenCalled();
        expect(carsService.getManufacturer).toHaveBeenCalledWith(createdCarId);
        expect(queryBus.execute).toHaveBeenCalled();
        expect(queryBus.execute).toHaveBeenCalledWith(
          new CarManufacturerQuery(createdCarId),
        );
        expect(carsRepository.findOneById).toHaveBeenCalledWith(createdCarId);
      });

      it('Should return a manufacturer', async () => {
        expect(manufacturer).toEqual(manufacturerCreated);
      });

      afterEach(async () => {
        const carModel = await carsRepository.findOneById(createdCarId);
        await carsRepository.remove(carModel);
        await manufacturersRepository.remove(manufacturerCreated);
      });
    });
  });

  describe('getAll', () => {
    describe('When getAll is called', () => {
      let carsCreated: Car[];
      let cars: Car[];
      let manufacturersCreated: Manufacturer[];
      const createCarsData = Array.from({ length: 3 }).map((_, index) => {
        return new Car({
          ...createCarDto,
          price: 100 + index,
          manufacturer: {
            ...createCarDto.manufacturer,
            name: `${createCarDto.manufacturer.name}-${index}`,
          },
        });
      });

      beforeEach(async () => {
        const carsData = await carsRepository.createMany(createCarsData);
        carsCreated = carsData.map(
          (car) => new Car({ ...car, manufacturer: null }),
        );
        manufacturersCreated = carsData.map(
          (car) => new Manufacturer(car.manufacturer),
        );
        jest.spyOn(carsService, 'getAll');
        jest.spyOn(queryBus, 'execute');
        jest.spyOn(carsRepository, 'find');
        cars = await carsController.getAll();
      });

      it('Should call CarsService', () => {
        expect(carsService.getAll).toHaveBeenCalled();
        expect(queryBus.execute).toHaveBeenCalled();
        expect(queryBus.execute).toHaveBeenCalledWith(new CarsQuery());
        expect(carsRepository.find).toHaveBeenCalledWith({});
      });

      it('Should return cars', async () => {
        expect(cars).toContainEqual(carsCreated[0]);
        expect(cars).toContainEqual(carsCreated[1]);
        expect(cars).toContainEqual(carsCreated[2]);
      });

      afterEach(async () => {
        await carsRepository.removeMany(carsCreated);
        await manufacturersRepository.removeMany(manufacturersCreated);
      });
    });
  });

  describe('updateCarsData', () => {
    describe('When updateCarsData is called', () => {
      let carsCreated: Car[];
      let carsUpdated: Car[];
      let manufacturersCreated: Manufacturer[];
      let ownersCreated: Owner[];
      const date18MonthsAgo = subMonths(new Date(), 18);
      const date12MonthsAgo = subMonths(new Date(), 12);
      const date18MonthsAgoFormatted = format(
        startOfDay(date18MonthsAgo),
        DATE_FORMAT,
      );
      const date12MonthsAgoFormatted = format(
        startOfDay(date12MonthsAgo),
        DATE_FORMAT,
      );

      const date19MonthsAgo = subMonths(new Date(), 19);
      const date20MonthsAgo = subMonths(new Date(), 20);
      const date21MonthsAgo = subMonths(new Date(), 21);
      const carsData = Array.from({ length: 3 }).map((_, index) => {
        return new Car({
          ...createCarDto,
          price: 10000 + index,
          firstRegistrationDate: new Date(
            format(startOfDay(subMonths(new Date(), 12 + index)), DATE_FORMAT),
          ),
          manufacturer: {
            ...createCarDto.manufacturer,
            name: `${createCarDto.manufacturer.name}-${index}`,
          },
          owners: [
            {
              name: `Owner1-${index}`,
              purchaseDate: new Date(
                format(startOfDay(date19MonthsAgo), DATE_FORMAT),
              ),
            },
            {
              name: `Owner2-${index}`,
              purchaseDate: new Date(
                format(startOfDay(date20MonthsAgo), DATE_FORMAT),
              ),
            },
            {
              name: `Owner3-${index}`,
              purchaseDate: new Date(
                format(startOfDay(date21MonthsAgo), DATE_FORMAT),
              ),
            },
          ],
        });
      });
      beforeEach(async () => {
        const cars = await carsRepository.createMany(carsData);
        carsCreated = cars.map(
          (carEntity) => new Car({ ...carEntity, owners: [] }),
        );
        manufacturersCreated = cars.map(
          (car) => new Manufacturer(car.manufacturer),
        );
        ownersCreated = cars.reduce((acc, prevItem: CarEntity) => {
          const owners = prevItem.owners.map((o) => new Owner(o));
          return acc.concat(owners);
        }, []);
        jest.spyOn(carsService, 'updateCarsData');
        jest.spyOn(commandBus, 'execute');
        jest.spyOn(carsRepository, 'find');
        jest.spyOn(carsRepository, 'updateMany');
        jest.spyOn(ownersRepository, 'findAndSoftRemove');
        await carsController.updateCarsData();
        carsUpdated = await carsRepository.find(
          {
            firstRegistrationDate: Between(
              new Date(date18MonthsAgoFormatted),
              new Date(date12MonthsAgoFormatted),
            ),
          },
          { manufacturer: true, owners: true },
        );
      });

      it('Should call CarsService', async () => {
        expect(carsService.updateCarsData).toHaveBeenCalled();
        expect(commandBus.execute).toHaveBeenCalled();
        expect(commandBus.execute).toHaveBeenCalledWith(
          new UpdateCarsDataCommand(),
        );
        expect(carsRepository.find).toHaveBeenCalled();
        expect(carsRepository.find).toHaveBeenCalledWith(
          {
            firstRegistrationDate: Between(
              new Date(date18MonthsAgoFormatted),
              new Date(date12MonthsAgoFormatted),
            ),
          },
          { manufacturer: true, owners: true },
        );
        expect(carsRepository.updateMany).toHaveBeenCalled();
        expect(ownersRepository.findAndSoftRemove).toHaveBeenCalled();
        expect(ownersRepository.findAndSoftRemove).toHaveBeenCalledWith({
          purchaseDate: LessThan(new Date(date18MonthsAgoFormatted)),
          deletedAt: IsNull(),
        });
      });

      it('Car prices should change', async () => {
        expect(carsUpdated.length).toEqual(carsCreated.length);
        carsUpdated.forEach((carFetched) => {
          const carCreated = carsCreated.find(
            (c) => c.getId() === carFetched.getId(),
          );
          carCreated.applyDiscount();
          expect(carFetched.getPrice()).toEqual(carCreated.getPrice());
        });
      });

      it('Owners should be removed', async () => {
        carsUpdated.forEach((car) => {
          expect(car.getOwnersData()).toStrictEqual([]);
        });
      });

      afterEach(async () => {
        await ownersRepository.removeMany(ownersCreated);
        await carsRepository.removeMany(carsCreated);
        await manufacturersRepository.removeMany(manufacturersCreated);
      });
    });
  });

  describe('remove', () => {
    describe('When remove is called', () => {
      let createdCarId: number;
      let createdCar: Car;
      let createdManufacturer: Manufacturer;
      beforeEach(async () => {
        const { id: carId, manufacturer } = await carsService.create(
          createCarDto,
        );
        createdCarId = carId;
        createdCar = await carsRepository.findOneById(createdCarId);
        createdManufacturer = manufacturer;
        jest.spyOn(carsService, 'remove');
        jest.spyOn(commandBus, 'execute');
        jest.spyOn(carsRepository, 'findOneById');
        jest.spyOn(carsRepository, 'softRemove');
        await carsController.remove(createdCarId);
      });

      it('Should call CarsService', async () => {
        expect(carsService.remove).toHaveBeenCalled();
        expect(carsService.remove).toHaveBeenCalledWith(createdCarId);
        expect(commandBus.execute).toHaveBeenCalled();
        expect(commandBus.execute).toHaveBeenCalledWith(
          new RemoveCarCommand(createdCarId),
        );
        expect(carsRepository.findOneById).toHaveBeenCalledWith(createdCarId);
        expect(carsRepository.softRemove).toHaveBeenCalled();
      });

      afterEach(async () => {
        await carsRepository.recover(createdCar);
        const carModel = await carsRepository.findOneById(createdCarId);
        await carsRepository.remove(carModel);
        await manufacturersRepository.remove(createdManufacturer);
      });
    });
  });

  afterEach(async () => {
    await module.close();
  });
});

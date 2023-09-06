import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';
import { CreateCarDto } from '../src/cars/dto/create-car.dto';
import { UpdateCarDto } from '../src/cars/dto/update-car.dto';
import { CarsRepository } from '../src/cars/cars.repository';
import { Car } from '../src/cars/models/Car';
import { ManufacturersRepository } from '../src/cars/manufacturers.repository';
import { Manufacturer } from '../src/cars/models/Manufacturer';

const incorrectCarId = '999444998';
const createDto: CreateCarDto = {
  price: 1111,
  firstRegistrationDate: new Date(),
  manufacturer: {
    name: 'test',
    phone: '+380667788990',
    siret: '11111111111111',
  },
};

const updateDto: UpdateCarDto = {
  price: 2222,
  manufacturer: {
    name: 'test-updated',
    phone: '+380667788990',
    siret: '11111111111112',
  },
};

describe('CarsController (e2e)', () => {
  let app: INestApplication;
  let createdCarId: number;
  let createdCar: Car;
  let createdManufacturer: Manufacturer;
  let carsRepository: CarsRepository;
  let manufacturersRepository: ManufacturersRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );

    carsRepository = moduleFixture.get<CarsRepository>(CarsRepository);
    manufacturersRepository = moduleFixture.get<ManufacturersRepository>(
      ManufacturersRepository,
    );

    const configService = app.get<ConfigService>(ConfigService);
    await app.listen(configService.get<number>('HTTP_PORT'));
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });

  it('/cars (POST) - fail', async () => {
    return request(app.getHttpServer())
      .post('/cars')
      .send({
        ...createDto,
        firstRegistrationDate: undefined,
      })
      .expect(400)
      .then((response: request.Response) => {
        const { body } = response;
        const { message } = body;
        expect(message).toBeDefined();
        expect(message).toContain(
          'firstRegistrationDate must be a Date instance',
        );
      });
  });

  it('/cars (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/cars')
      .send(createDto)
      .expect(201)
      .then((response: request.Response) => {
        const { body } = response;
        createdCarId = body.id;
        createdCar = new Car(body);
        createdManufacturer = new Manufacturer(body.manufacturer);
        expect(createdCarId).toBeDefined();
      });
  });

  it('/cars/:id (GET) - fail', async () => {
    return request(app.getHttpServer())
      .get(`/cars/${incorrectCarId}`)
      .expect(404)
      .then((response: request.Response) => {
        const { body } = response;
        const { message } = body;
        expect(message).toBeDefined();
        expect(message).toBe('Entity not found');
      });
  });

  it('/cars/:id (GET) - success', async () => {
    return request(app.getHttpServer())
      .get(`/cars/${createdCarId}`)
      .expect(200)
      .then((response: request.Response) => {
        const { body } = response;
        expect(body.id).toBe(createdCarId);
        expect(body.price).toBe(createDto.price);
        expect(new Date(body.firstRegistrationDate)).toStrictEqual(
          createDto.firstRegistrationDate,
        );
      });
  });

  it('/cars (GET) - success', async () => {
    return request(app.getHttpServer())
      .get('/cars')
      .expect(200)
      .then((response: request.Response) => {
        const { body } = response;
        expect(body.length).toBe(1);
      });
  });

  it('/cars/:id/manufacturer (GET) - fail', async () => {
    return request(app.getHttpServer())
      .get(`/cars/${incorrectCarId}/manufacturer`)
      .expect(404)
      .then((response: request.Response) => {
        const { body } = response;
        const { message } = body;
        expect(message).toBeDefined();
        expect(message).toBe('Entity not found');
      });
  });

  it('/cars/:id/manufacturer (GET) - success', async () => {
    return request(app.getHttpServer())
      .get(`/cars/${createdCarId}/manufacturer`)
      .expect(200)
      .then((response: request.Response) => {
        const { body } = response;
        expect(body.name).toBeDefined();
        expect(body.name).toBe(createDto.manufacturer.name);
        expect(body.phone).toBeDefined();
        expect(body.phone).toBe(createDto.manufacturer.phone);
        expect(body.siret).toBeDefined();
        expect(body.siret).toBe(createDto.manufacturer.siret);
      });
  });

  it('/cars/:id (PATCH) - fail', async () => {
    return request(app.getHttpServer())
      .patch(`/cars/${incorrectCarId}`)
      .expect(404)
      .then((response: request.Response) => {
        const { body } = response;
        const { message } = body;
        expect(message).toBeDefined();
        expect(message).toBe('Entity not found');
      });
  });

  it('/cars/:id (PATCH) - success', async () => {
    return request(app.getHttpServer())
      .patch(`/cars/${createdCarId}`)
      .send(updateDto)
      .expect(200)
      .then((response: request.Response) => {
        const { body } = response;
        expect(body.price).toBe(updateDto.price);
        expect(body.manufacturer.name).toBe(updateDto.manufacturer.name);
        expect(body.manufacturer.phone).toBe(updateDto.manufacturer.phone);
        expect(body.manufacturer.siret).toBe(updateDto.manufacturer.siret);
      });
  });

  it('/cars/update (POST) - success', async () => {
    return request(app.getHttpServer()).post('/cars/update').expect(200);
  });

  it('/cars/:id (DELETE) - fail', async () => {
    return request(app.getHttpServer())
      .delete(`/cars/${incorrectCarId}`)
      .expect(404)
      .then((response: request.Response) => {
        const { body } = response;
        const { message } = body;
        expect(message).toBeDefined();
        expect(message).toBe('Entity not found');
      });
  });

  it('/cars/:id (DELETE) - success', async () => {
    return request(app.getHttpServer())
      .delete(`/cars/${createdCarId}`)
      .expect(200);
  });

  afterAll(async () => {
    await carsRepository.recover(createdCar);
    await carsRepository.remove(createdCar);
    await manufacturersRepository.recover(createdManufacturer);
    await manufacturersRepository.remove(createdManufacturer);
    await app.close();
  });
});

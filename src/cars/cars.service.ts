import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Car } from './models/Car';
import { Manufacturer } from './models/Manufacturer';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarQuery } from './queries/car/car.query';
import { CarsQuery } from './queries/cars/cars.query';
import { CarManufacturerQuery } from './queries/car-manufacturer/car-manufacturer.query';
import { CreateCarCommand } from './commands/create-car/create-car.command';
import { UpdateCarCommand } from './commands/update-car/update-car.command';
import { RemoveCarCommand } from './commands/remove-car/remove-car.command';
import { UpdateCarsDataCommand } from './commands/update-cars-data/update-cars-data.command';

@Injectable()
export class CarsService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async getAll(): Promise<Car[]> {
    return this.queryBus.execute<CarsQuery, Car[]>(new CarsQuery());
  }

  async getOne(carId: number): Promise<Car> {
    return this.queryBus.execute<CarQuery, Car>(new CarQuery(carId));
  }

  async getManufacturer(carId: number): Promise<Manufacturer> {
    return this.queryBus.execute<CarManufacturerQuery, Manufacturer>(
      new CarManufacturerQuery(carId),
    );
  }

  async create(dto: CreateCarDto): Promise<Car> {
    return this.commandBus.execute<CreateCarCommand, Car>(
      new CreateCarCommand(dto),
    );
  }

  async update(carId: number, dto: UpdateCarDto): Promise<Car> {
    return this.commandBus.execute<UpdateCarCommand, Car>(
      new UpdateCarCommand(carId, dto),
    );
  }

  async updateCarsData(): Promise<void> {
    await this.commandBus.execute<UpdateCarsDataCommand, void>(
      new UpdateCarsDataCommand(),
    );
  }

  async remove(carId: number): Promise<void> {
    await this.commandBus.execute<RemoveCarCommand, void>(
      new RemoveCarCommand(carId),
    );
  }
}

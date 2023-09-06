import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from '@app/common';
import { Car as CarEntity } from './entities/car.entity';
import { Car as CarModel } from './models/Car';
import { CarSchemaFactory } from './car.schema.factory';

@Injectable()
export class CarsRepository extends AbstractRepository<CarEntity, CarModel> {
  protected readonly logger = new Logger(CarsRepository.name);
  constructor(
    @InjectRepository(CarEntity) carsRepository: Repository<CarEntity>,
    carSchemaFactory: CarSchemaFactory,
  ) {
    super(carsRepository, carSchemaFactory);
  }

  async findOneById(carId: number) {
    return this.findOne({ id: carId }, { manufacturer: true, owners: true });
  }
}

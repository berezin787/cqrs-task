import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CarsQuery } from './cars.query';
import { Car } from '../../models/Car';
import { CarsRepository } from '../../cars.repository';

@QueryHandler(CarsQuery)
export class CarsHandler implements IQueryHandler<CarsQuery> {
  constructor(private readonly carsRepository: CarsRepository) {}
  async execute(): Promise<Car[]> {
    return this.carsRepository.find({});
  }
}

import { EventPublisher, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CarQuery } from './car.query';
import { CarsRepository } from '../../cars.repository';
import { Car } from '../../models/Car';

@QueryHandler(CarQuery)
export class CarHandler implements IQueryHandler<CarQuery> {
  constructor(
    private readonly carsRepository: CarsRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ carId }: CarQuery): Promise<Car> {
    const car = this.eventPublisher.mergeObjectContext(
      await this.carsRepository.findOneById(carId),
    );
    car.commit();
    return car;
  }
}

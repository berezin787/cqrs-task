import { EventPublisher, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CarManufacturerQuery } from './car-manufacturer.query';
import { CarsRepository } from '../../cars.repository';
import { Manufacturer } from '../../models/Manufacturer';

@QueryHandler(CarManufacturerQuery)
export class CarManufacturerHandler
  implements IQueryHandler<CarManufacturerQuery>
{
  constructor(
    private readonly carsRepository: CarsRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ carId }: CarManufacturerQuery): Promise<Manufacturer> {
    const car = this.eventPublisher.mergeObjectContext(
      await this.carsRepository.findOneById(carId),
    );

    car.commit();
    return car.getManufacturerData();
  }
}

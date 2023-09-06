import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCarCommand } from './update-car.command';
import { CarsRepository } from '../../cars.repository';
import { CarUpdatedEvent } from '../../events/car-updated/car-updated.event';
import { Car } from '../../models/Car';

@CommandHandler(UpdateCarCommand)
export class UpdateCarHandler implements ICommandHandler<UpdateCarCommand> {
  constructor(
    private readonly carsRepository: CarsRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ carId, dto }: UpdateCarCommand): Promise<Car> {
    const car = this.eventPublisher.mergeObjectContext(
      await this.carsRepository.findOneById(carId),
    );

    if (dto.price) {
      car.setPrice(dto.price);
    }

    if (dto.firstRegistrationDate) {
      car.setFirstRegDate(dto.firstRegistrationDate);
    }

    if (dto.manufacturer) {
      car.setManufacturer(dto.manufacturer);
    }

    if (dto.owners) {
      car.setOwners(dto.owners);
    }

    await this.carsRepository.update(car);
    car.apply(new CarUpdatedEvent(car));
    car.commit();
    return car;
  }
}

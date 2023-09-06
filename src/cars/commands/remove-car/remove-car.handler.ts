import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RemoveCarCommand } from './remove-car.command';
import { CarsRepository } from '../../cars.repository';
import { CarDeletedEvent } from '../../events/car-deleted/car-deleted.event';

@CommandHandler(RemoveCarCommand)
export class RemoveCarHandler implements ICommandHandler<RemoveCarCommand> {
  constructor(
    private readonly carsRepository: CarsRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}
  async execute({ carId }: RemoveCarCommand): Promise<void> {
    const car = this.eventPublisher.mergeObjectContext(
      await this.carsRepository.findOneById(carId),
    );
    await this.carsRepository.softRemove(car);
    car.apply(new CarDeletedEvent(car));
    car.commit();
  }
}

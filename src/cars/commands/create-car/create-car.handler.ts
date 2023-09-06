import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateCarCommand } from './create-car.command';
import { CarsRepository } from '../../cars.repository';
import { Car } from '../../models/Car';
import { CarCreatedEvent } from '../../events/car-created/car-created.event';

@CommandHandler(CreateCarCommand)
export class CreateCarHandler implements ICommandHandler<CreateCarCommand> {
  constructor(
    private readonly carsRepository: CarsRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ dto }: CreateCarCommand) {
    const carModel = new Car(dto);
    const car = await this.carsRepository.create(carModel);
    this.eventBus.publish(new CarCreatedEvent(car));
    carModel.commit();
    return car;
  }
}

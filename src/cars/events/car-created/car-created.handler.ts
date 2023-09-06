import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CarCreatedEvent } from './car-created.event';
import { Logger } from '@nestjs/common';

@EventsHandler(CarCreatedEvent)
export class CarCreatedHandler implements IEventHandler<CarCreatedEvent> {
  private readonly logger = new Logger(CarCreatedHandler.name);

  async handle({ car }: CarCreatedEvent) {
    this.logger.log('Car created event !, car: ', JSON.stringify(car));
  }
}

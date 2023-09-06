import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CarUpdatedEvent } from './car-updated.event';
import { Logger } from '@nestjs/common';

@EventsHandler(CarUpdatedEvent)
export class CarUpdatedHandler implements IEventHandler<CarUpdatedEvent> {
  public readonly logger = new Logger(CarUpdatedHandler.name);

  async handle({ car }: CarUpdatedEvent) {
    this.logger.log('Car updated event !', JSON.stringify(car));
  }
}

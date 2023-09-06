import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CarDeletedEvent } from './car-deleted.event';
import { Logger } from '@nestjs/common';

@EventsHandler(CarDeletedEvent)
export class CarDeletedHandler implements IEventHandler<CarDeletedEvent> {
  private readonly logger = new Logger(CarDeletedHandler.name);

  async handle({ car }: CarDeletedEvent) {
    this.logger.log('Car deleted event !, car: ', JSON.stringify(car));
  }
}

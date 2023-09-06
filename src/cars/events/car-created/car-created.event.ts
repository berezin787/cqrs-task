import { Car } from '../../entities/car.entity';

export class CarCreatedEvent {
  constructor(public readonly car: Car) {}
}

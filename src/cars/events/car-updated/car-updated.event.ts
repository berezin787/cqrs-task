import { Car } from '../../models/Car';

export class CarUpdatedEvent {
  constructor(public readonly car: Car) {}
}

import { Car } from '../../models/Car';

export class CarDeletedEvent {
  constructor(public readonly car: Car) {}
}

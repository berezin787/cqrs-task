import { CreateCarHandler } from './create-car/create-car.handler';
import { UpdateCarHandler } from './update-car/update-car.handler';
import { RemoveCarHandler } from './remove-car/remove-car.handler';
import { UpdateCarsDataHandler } from './update-cars-data/update-cars-data.handler';

export const CarCommandHandlers = [
  CreateCarHandler,
  UpdateCarHandler,
  RemoveCarHandler,
  UpdateCarsDataHandler,
];

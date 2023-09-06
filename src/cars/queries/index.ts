import { CarHandler } from './car/car.handler';
import { CarsHandler } from './cars/cars.handler';
import { CarManufacturerHandler } from './car-manufacturer/car-manufacturer.handler';

export const CarQueryHandlers = [
  CarsHandler,
  CarHandler,
  CarManufacturerHandler,
];

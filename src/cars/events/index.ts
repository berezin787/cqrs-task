import { CarCreatedHandler } from './car-created/car-created.handler';
import { CarUpdatedHandler } from './car-updated/car-updated.handler';
import { CarDeletedHandler } from './car-deleted/car-deleted.handler';

export const CarEventsHandlers = [
  CarCreatedHandler,
  CarUpdatedHandler,
  CarDeletedHandler,
];

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '@app/common';
import { Car } from './entities/car.entity';
import { Manufacturer } from './entities/manufacturer.entity';
import { Owner } from './entities/owner.entity';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { CarsRepository } from './cars.repository';
import { CarCommandHandlers } from './commands';
import { CarQueryHandlers } from './queries';
import { CarSchemaFactory } from './car.schema.factory';
import { CarEventsHandlers } from './events';
import { OwnerSchemaFactory } from './owner.schema.factory';
import { OwnersRepository } from './owners.repository';
import { ManufacturersRepository } from './manufacturers.repository';
import { ManufacturerSchemaFactory } from './manufacturer.schema.factory';

@Module({
  imports: [CqrsModule, DatabaseModule.forFeature([Car, Manufacturer, Owner])],
  controllers: [CarsController],
  providers: [
    CarsService,
    CarsRepository,
    CarSchemaFactory,
    OwnersRepository,
    OwnerSchemaFactory,
    ManufacturersRepository,
    ManufacturerSchemaFactory,
    ...CarCommandHandlers,
    ...CarQueryHandlers,
    ...CarEventsHandlers,
  ],
})
export class CarsModule {}

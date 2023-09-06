import { Injectable } from '@nestjs/common';
import { EntitySchemaFactory } from '@app/common';
import { Car as CarEntity } from './entities/car.entity';
import { Manufacturer as ManufacturerEntity } from './entities/manufacturer.entity';
import { Owner as OwnerEntity } from './entities/owner.entity';
import { Car as CarModel } from './models/Car';

@Injectable()
export class CarSchemaFactory
  implements EntitySchemaFactory<CarEntity, CarModel>
{
  create(carModel: CarModel): CarEntity {
    return new CarEntity({
      id: carModel.getId(),
      price: carModel.getPrice(),
      manufacturer: new ManufacturerEntity({
        ...carModel.getManufacturerData(),
      }),
      firstRegistrationDate: carModel.getFirstRegistrationDate(),
      owners: carModel.getOwnersData()?.length
        ? carModel.getOwnersData().map((owner) => new OwnerEntity(owner))
        : [],
    });
  }
  createFromSchema(carEntity: CarEntity): CarModel {
    return new CarModel(carEntity);
  }
}

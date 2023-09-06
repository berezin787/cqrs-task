import { Injectable } from '@nestjs/common';
import { EntitySchemaFactory } from '@app/common';
import { Manufacturer as ManufacturerModel } from './models/Manufacturer';
import { Manufacturer as ManufacturerEntity } from './entities/manufacturer.entity';

@Injectable()
export class ManufacturerSchemaFactory
  implements EntitySchemaFactory<ManufacturerEntity, ManufacturerModel>
{
  create(manufacturerModel: ManufacturerModel): ManufacturerEntity {
    return new ManufacturerEntity(manufacturerModel);
  }

  createFromSchema(manufacturerEntity: ManufacturerEntity): ManufacturerModel {
    return new ManufacturerModel(manufacturerEntity);
  }
}

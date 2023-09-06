import { Injectable } from '@nestjs/common';
import { EntitySchemaFactory } from '@app/common';
import { Owner as OwnerEntity } from './entities/owner.entity';
import { Owner as OwnerModel } from './models/Owner';

@Injectable()
export class OwnerSchemaFactory
  implements EntitySchemaFactory<OwnerEntity, OwnerModel>
{
  create(ownerModel: OwnerModel): OwnerEntity {
    return new OwnerEntity(ownerModel);
  }

  createFromSchema(ownerEntity: OwnerEntity): OwnerModel {
    return new OwnerModel(ownerEntity);
  }
}

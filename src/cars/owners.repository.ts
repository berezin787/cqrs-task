import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from '@app/common';
import { Owner as OwnerEntity } from './entities/owner.entity';
import { Owner as OwnerModel } from './models/Owner';
import { OwnerSchemaFactory } from './owner.schema.factory';

@Injectable()
export class OwnersRepository extends AbstractRepository<
  OwnerEntity,
  OwnerModel
> {
  protected readonly logger = new Logger(OwnersRepository.name);

  constructor(
    @InjectRepository(OwnerEntity) ownersRepository: Repository<OwnerEntity>,
    ownerSchemaFactory: OwnerSchemaFactory,
  ) {
    super(ownersRepository, ownerSchemaFactory);
  }
}

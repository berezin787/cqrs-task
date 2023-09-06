import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { Manufacturer as ManufacturerModel } from './models/Manufacturer';
import { Manufacturer as ManufacturerEntity } from './entities/manufacturer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManufacturerSchemaFactory } from './manufacturer.schema.factory';

@Injectable()
export class ManufacturersRepository extends AbstractRepository<
  ManufacturerEntity,
  ManufacturerModel
> {
  protected readonly logger = new Logger(ManufacturersRepository.name);
  constructor(
    @InjectRepository(ManufacturerEntity)
    manufacturersRepository: Repository<ManufacturerEntity>,
    manufacturerSchemaFactory: ManufacturerSchemaFactory,
  ) {
    super(manufacturersRepository, manufacturerSchemaFactory);
  }
}

import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from '@app/common/database/abstract.entity';
import { AggregateRoot } from '@nestjs/cqrs';
import { EntitySchemaFactory } from '@app/common';

export abstract class AbstractRepository<
  TEntity extends AbstractEntity<TEntity>,
  TModel extends AggregateRoot,
> {
  protected abstract readonly logger: Logger;
  protected constructor(
    private readonly entityRepository: Repository<TEntity>,
    private readonly entitySchemaFactory: EntitySchemaFactory<TEntity, TModel>,
  ) {}

  async create(model: TModel): Promise<TEntity> {
    return this.entityRepository.save(this.entitySchemaFactory.create(model));
  }

  async createMany(models: TModel[]): Promise<TEntity[]> {
    return this.entityRepository.save(
      models.map((model: TModel) => this.entitySchemaFactory.create(model)),
    );
  }

  async findOne(
    where: FindOptionsWhere<TEntity>,
    relations?: FindOptionsRelations<TEntity>,
  ): Promise<TModel> {
    const entity = await this.entityRepository.findOne({ where, relations });
    if (!entity) {
      this.logger.warn('Entity not found with where clause', where);
      throw new NotFoundException('Entity not found');
    }
    return this.entitySchemaFactory.createFromSchema(entity);
  }

  async update(partialEntity: TModel): Promise<void> {
    await this.entityRepository.save(
      this.entitySchemaFactory.create(partialEntity),
    );
  }

  async updateMany(partialEntity: TModel[]): Promise<void> {
    await this.entityRepository.save(
      partialEntity.map((pEntity) => this.entitySchemaFactory.create(pEntity)),
    );
  }

  async find(
    where: FindOptionsWhere<TEntity>,
    relations?: FindOptionsRelations<TEntity>,
  ): Promise<TModel[]> {
    return (await this.entityRepository.find({ where, relations })).map(
      (entity: TEntity) => this.entitySchemaFactory.createFromSchema(entity),
    );
  }

  async softRemove(partialEntity: TModel) {
    await this.entityRepository.softRemove(
      this.entitySchemaFactory.create(partialEntity),
    );
  }

  async findAndSoftRemove(where: FindOptionsWhere<TEntity>): Promise<void> {
    await this.entityRepository.softDelete(where);
  }

  async remove(partialEntity: TModel): Promise<void> {
    await this.entityRepository.remove(
      this.entitySchemaFactory.create(partialEntity),
    );
  }

  async removeMany(models: TModel[]): Promise<void> {
    await this.entityRepository.remove(
      models.map((model: TModel) => this.entitySchemaFactory.create(model)),
    );
  }

  async recover(partialEntity: TModel): Promise<void> {
    await this.entityRepository.recover(
      this.entitySchemaFactory.create(partialEntity),
    );
  }
}

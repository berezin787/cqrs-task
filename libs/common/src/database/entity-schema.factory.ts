import { AggregateRoot } from '@nestjs/cqrs';
import { AbstractEntity } from '@app/common';

export interface EntitySchemaFactory<
  TEntity extends AbstractEntity<TModel>,
  TModel extends AggregateRoot,
> {
  create(entity: TModel): TEntity;
  createFromSchema(entitySchema: TEntity): TModel;
}

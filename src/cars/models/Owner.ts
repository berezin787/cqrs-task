import { AggregateRoot } from '@nestjs/cqrs';
import { Owner as OwnerEntity } from '../entities/owner.entity';

export class Owner extends AggregateRoot {
  readonly id: number | undefined = undefined;
  readonly name: string;
  readonly purchaseDate: Date | null = null;

  constructor(entity: Partial<OwnerEntity>) {
    super();
    Object.assign(this, entity);
  }
}

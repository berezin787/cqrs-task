import { AggregateRoot } from '@nestjs/cqrs';
import { Manufacturer as ManufacturerEntity } from '../entities/manufacturer.entity';

export class Manufacturer extends AggregateRoot {
  readonly id: number | undefined = undefined;
  name: string;
  phone: string;
  siret: string;

  constructor(entity: Partial<ManufacturerEntity>) {
    super();
    Object.assign(this, entity);
  }

  setName(name: string) {
    this.name = name;
  }

  setPhone(phone: string) {
    this.phone = phone;
  }

  setSiret(siret: string) {
    this.siret = siret;
  }
}

import { AggregateRoot } from '@nestjs/cqrs';
import { Car as CarEntity } from '../entities/car.entity';
import { Manufacturer as ManufacturerEntity } from '../entities/manufacturer.entity';
import { Owner as OwnerEntity } from '../entities/owner.entity';
import { Manufacturer } from './Manufacturer';
import { Owner } from './Owner';
import { CreateOwnerDto } from '../dto/create-owner.dto';
import { CreateCarDto } from '../dto/create-car.dto';

const DISCOUNT = 0.2;

export class Car extends AggregateRoot {
  readonly id: number | undefined = undefined;
  price: number;
  firstRegistrationDate: Date;
  manufacturer: Manufacturer | null;
  owners: Owner[];

  constructor(entity: Partial<CarEntity> | CreateCarDto) {
    super();
    Object.assign(this, entity);
    this.owners = [];
    this.setManufacturer(entity.manufacturer);
    this.setOwners(entity.owners);
  }

  applyDiscount(discount = DISCOUNT) {
    const newPrice = this.getPrice() - this.getPrice() * discount;
    this.setPrice(newPrice);
  }

  setPrice(price: number) {
    this.price = price;
  }

  setFirstRegDate(date: Date) {
    this.firstRegistrationDate = date;
  }

  setManufacturer(manufacturerData: Partial<ManufacturerEntity>) {
    if (!manufacturerData) {
      this.manufacturer = null;
      return;
    }

    if (this.manufacturer === null) {
      this.manufacturer = new Manufacturer(manufacturerData);
    } else {
      this.manufacturer = new Manufacturer({
        ...this.manufacturer,
        ...manufacturerData,
      });
    }
  }

  setOwners(ownersData: Partial<OwnerEntity>[] | [] | undefined) {
    if (!ownersData || ownersData?.length < 1) {
      this.owners = [];
      return;
    }

    const owners = ownersData.map(
      (ownerItem: CreateOwnerDto) => new Owner(ownerItem),
    );
    if (this.owners.length === 0) {
      this.owners = owners;
    } else {
      owners.forEach((owner) => {
        const existingOwnerIndex = this.owners.findIndex(
          (o) => o.id && o.id > 0 && o.id === owner.id,
        );
        if (existingOwnerIndex === -1) {
          this.owners.push(owner);
        } else {
          this.owners.splice(existingOwnerIndex, 1, owner);
        }
      });
    }
  }

  getId() {
    return this.id;
  }

  getPrice() {
    return this.price;
  }

  getManufacturerData(): Manufacturer {
    return this.manufacturer;
  }

  getFirstRegistrationDate(): Date {
    return this.firstRegistrationDate;
  }

  getOwnersData(): Owner[] {
    return this.owners;
  }
}

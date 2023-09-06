import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Manufacturer } from './manufacturer.entity';
import { Owner } from './owner.entity';

@Entity({ name: 'cars' })
export class Car extends AbstractEntity<Car> {
  @OneToOne(() => Manufacturer, { cascade: true })
  @JoinColumn()
  manufacturer: Manufacturer;

  @Column({ type: 'float', default: 0.0 })
  price: number;

  @Column({ type: Date })
  firstRegistrationDate: Date;

  @OneToMany(() => Owner, (owner) => owner.car, { cascade: true })
  owners: Owner[];

  @CreateDateColumn({ default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}

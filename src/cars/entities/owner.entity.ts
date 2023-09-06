import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Car } from './car.entity';

@Entity({ name: 'owners' })
export class Owner extends AbstractEntity<Owner> {
  @ManyToOne(() => Car, (car) => car.owners)
  car: Car;

  @Column()
  name: string;

  @Column({ type: Date })
  purchaseDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

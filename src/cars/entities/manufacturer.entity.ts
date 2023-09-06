import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from '@app/common';

@Entity({ name: 'manufacturers' })
export class Manufacturer extends AbstractEntity<Manufacturer> {
  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  siret: string;

  @CreateDateColumn({ default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}

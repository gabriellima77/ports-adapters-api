import { Location } from '../../location/entities/location.model';
import { User } from '../../user/entities/user.model';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['cnpj'])
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  cnpj: string;

  @Column({
    nullable: true,
  })
  website?: string;

  @ManyToOne(() => User, (user) => user.companies, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Location, (location) => location.company, {
    eager: true,
    cascade: true,
  })
  locations: Location[];
}

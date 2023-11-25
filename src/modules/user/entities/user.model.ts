import { Company } from '../../company/entities/company.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Company, (company) => company.user, {
    eager: true,
    cascade: true,
  })
  companies: Company[];
}

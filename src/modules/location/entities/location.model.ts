import { Company } from '../../company/entities/company.model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  cep: string;

  @Column()
  street: string;

  @Column()
  houseNumber: string;

  @Column()
  neighborhood: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @ManyToOne(() => Company, (company) => company.locations, {
    onDelete: 'CASCADE',
  })
  company: Company;
}

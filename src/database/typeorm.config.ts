import 'dotenv/config';
import { join } from 'path';
import { Location } from '../modules/location/entities/location.model';
import { Company } from '../modules/company/entities/company.model';
import { User } from '../modules/user/entities/user.model';
import { DataSource } from 'typeorm';

const migrationsDir = join(
  __dirname,
  '..',
  'database',
  'migrations',
  '*{.ts,.js}',
);

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Company, Location],
  synchronize: false,
  migrations: [migrationsDir],
  migrationsTableName: 'migrations',
  migrationsRun: true,
  logging: false,
});

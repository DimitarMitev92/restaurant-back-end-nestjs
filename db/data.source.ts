import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export const dbdatasource: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/../db/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
};

const dataSource = new DataSource(dbdatasource);
export default dataSource;

// in terminal (npm run migration:generate ./db/migrations/name-of-migration)
// in terminal (npm run migration:run)

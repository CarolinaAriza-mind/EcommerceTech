import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { environment } from './enviroment.dev';
dotenvConfig({ path: '.env.development.local' });

const config = {
  type: 'postgres',
  database: environment.DB_NAME || 'ecommerce_pm4',
  localhost: environment.HOST || 'localhost',
  dbport: Number(environment.DB_PORT) || 5432,
  username: environment.DB_USERNAME || 'postgres',
  password: environment.DB_PASSWORD,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  logging: true,
  synchronize: true,
  dropSchema: false,
};

export const typeOrmConfig = registerAs('typeorm', () => config);

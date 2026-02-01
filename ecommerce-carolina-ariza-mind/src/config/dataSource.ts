import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

// Solo carga .env.development.local en desarrollo
if (process.env.NODE_ENV !== 'production') {
  dotenvConfig({ path: '.env.development.local' });
}

const config = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'ecommerce_pm4',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  logging: process.env.NODE_ENV !== 'production',
  synchronize: process.env.NODE_ENV !== 'production', // ⚠️ FALSE en producción
  dropSchema: false,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
};

export const typeOrmConfig = registerAs('typeorm', () => config);

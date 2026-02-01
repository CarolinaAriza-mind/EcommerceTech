import { registerAs } from '@nestjs/config';

const config = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME || 'ecommerce_pm4_y248',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  logging: process.env.NODE_ENV !== 'production',
  synchronize:
    process.env.DB_SYNCHRONIZE === 'true' ||
    process.env.NODE_ENV !== 'production', // ⚠️ FALSE en producción
  dropSchema: false,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
};

export const typeOrmConfig = registerAs('typeorm', () => config);

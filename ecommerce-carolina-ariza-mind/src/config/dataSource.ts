import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

console.log('========================================');
console.log('🔍 TYPEORM CONFIG DEBUG');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log(
  'DATABASE_URL value:',
  process.env.DATABASE_URL ? 'SET ✅' : 'UNDEFINED ❌',
);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('========================================');

// Si DATABASE_URL existe, úsala. Si no, usa variables individuales
const config: TypeOrmModuleOptions = process.env.DATABASE_URL
  ? {
      // PRODUCCIÓN con DATABASE_URL
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true, // 👈 Cambia a true para la primera ejecución
      logging: ['error', 'warn'],
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      // DESARROLLO con variables individuales
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecommerce_pm4',
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    };

export const typeOrmConfig = registerAs('typeorm', () => config);

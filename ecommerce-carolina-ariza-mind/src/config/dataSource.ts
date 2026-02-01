import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Detectar si estamos usando DATABASE_URL (Render) o variables individuales (Local)
const isDatabaseUrl = !!process.env.DATABASE_URL;

let config: TypeOrmModuleOptions;

if (isDatabaseUrl) {
  // ✅ PRODUCCIÓN: Usar DATABASE_URL de Render
  console.log('🔗 Conectando con DATABASE_URL (Render)');

  config = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    autoLoadEntities: true,
    logging: false,
    synchronize: false, // ⚠️ IMPORTANTE: false en producción
    ssl: {
      rejectUnauthorized: false, // Render requiere SSL
    },
  };
} else {
  // 🏠 DESARROLLO: Usar variables individuales
  console.log('===== DEBUG DB CONFIG (LOCAL) =====');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('DB_USERNAME:', process.env.DB_USERNAME);
  console.log(
    'DB_PASSWORD:',
    process.env.DB_PASSWORD ? '✅ EXISTE' : '❌ UNDEFINED',
  );
  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('===================================');

  if (!process.env.DB_PASSWORD) {
    throw new Error('❌ DB_PASSWORD no está definido');
  }

  config = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'ecommerce_pm4',
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    autoLoadEntities: true,
    logging: true,
    synchronize: true, // ✅ OK en desarrollo
    ssl: false,
  };
}

export const typeOrmConfig = registerAs('typeorm', () => config);

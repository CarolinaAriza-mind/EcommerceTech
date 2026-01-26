import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development.local' });

export const environment = {
  PORT: process.env.PORT || 5000,
  HOST: process.env.HOST || 'localhost',

  DB_NAME: process.env.DB_NAME || 'ecommerce_pm4',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_USERNAME: process.env.DB_USERNAME || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'mind1993',

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  //* JWT
  JWT_SECRET: process.env.JWT_SECRET,
};

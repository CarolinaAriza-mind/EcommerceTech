export const environment = {
  PORT: Number(process.env.PORT) || 5000,
  HOST: process.env.HOST || 'localhost',

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  //* JWT
  JWT_SECRET: process.env.JWT_SECRET,
};

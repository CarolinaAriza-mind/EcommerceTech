import { v2 as cloudinary } from 'cloudinary';
import { config as dotenvConfig } from 'dotenv';
import { environment } from './enviroment.dev';

dotenvConfig({ path: '.env.development.local' });

export const CloudinaryConfig = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    console.log('Cloudinary conectado con:', {
      cloud_name: environment.CLOUDINARY_CLOUD_NAME,
    });
    return cloudinary.config({
      cloud_name: environment.CLOUDINARY_CLOUD_NAME,
      api_key: environment.CLOUDINARY_API_KEY,
      api_secret: environment.CLOUDINARY_API_SECRET,
    });
  },
};

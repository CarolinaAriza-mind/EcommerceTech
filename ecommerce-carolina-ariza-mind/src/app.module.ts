import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'; // 👈 Importa TypeOrmModuleOptions
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesService } from './categories/categories.service';
import { ProductsService } from './products/products.service';
import { FileUploadModule } from './fileUpload/fileUpload.module';
import { JwtModule } from '@nestjs/jwt';
import { typeOrmConfig } from './config/dataSource';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env'
          : '.env.development.local',
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const config = configService.get<TypeOrmModuleOptions>('typeorm');
        if (!config) {
          throw new Error('❌ TypeORM configuration not found');
        }
        return config;
      },
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    FileUploadModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule, OnApplicationBootstrap {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }

  async onApplicationBootstrap() {
    // Solo cargar datos en desarrollo
    if (process.env.NODE_ENV !== 'production') {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log('🌱 Iniciando carga de datos de desarrollo...');
        await this.categoriesService.addCategories();
        console.log('✅ Categorias cargadas');

        await this.productsService.addProducts();
        console.log('✅ Productos cargados');
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        console.log('La aplicación continuará sin datos iniciales');
      }
    } else {
      console.log('🚀 Producción: Omitiendo carga automática de datos');
    }
  }
}

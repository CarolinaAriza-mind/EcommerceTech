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
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesService } from './categories/categories.service';
import { ProductsService } from './products/products.service';
import { FileUploadModule } from './fileUpload/fileUpload.module';
import { JwtModule } from '@nestjs/jwt';
import { typeOrmConfig } from './config/dataSource'; // 👈 Importa tu config

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env'
          : '.env.development.local',
      load: [typeOrmConfig], // 👈 Carga tu configuración
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 👈 Usa la configuración que ya definiste
        return configService.get('typeorm');
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
    try {
      // Esperar un poco para que TypeORM termine de sincronizar
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Iniciando carga de datos...');
      await this.categoriesService.addCategories();
      console.log('Categorias cargadas correctamente');

      await this.productsService.addProducts();
      console.log('Productos cargados correctamente');
    } catch (error) {
      console.error('Error al iniciar la aplicación:', error);
      // No lanzar el error para que la app siga funcionando
      console.log('La aplicación continuará sin datos iniciales');
    }
  }
}

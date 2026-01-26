import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './/entities/users.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, AuthGuard],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}

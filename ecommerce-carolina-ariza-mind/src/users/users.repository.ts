import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './/entities/users.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { CreateUserDto } from './dto/CreateUser.dto';

export type SafeUser = Omit<Users, 'isAdmin'>;
@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}
  async getUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const users = await this.usersRepository.find({
      take: limit,
      skip: skip,
    });

    return users.map(({ password, ...userNoPassword }) => userNoPassword);
  }

  async countUsers(): Promise<number> {
    return await this.usersRepository.count();
  }

  async getUser(id: string): Promise<Omit<SafeUser, 'password'>> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        orders: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id}, no encontrado`);
    }
    const { password, isAdmin, ...userAuth } = user;
    return userAuth;
  }

  async addUser(
    createUserDto: CreateUserDto,
  ): Promise<Omit<SafeUser, 'password'>> {
    const user = this.usersRepository.create(createUserDto);
    const newUser = await this.usersRepository.save(user);
    const { password, isAdmin, ...userAuth } = newUser;
    return userAuth;
  }

  async upDateUser(
    id: string,
    user: UpdateUserDto,
  ): Promise<Omit<SafeUser, 'password'>> {
    await this.usersRepository.update(id, user);
    const upDateUser = await this.usersRepository.findOne({
      where: { id },
      relations: { orders: true },
    });
    if (!upDateUser)
      throw new NotFoundException(`No existe usuario con id ${id}`);
    const { password, isAdmin, ...userNoPasswword } = upDateUser;
    return userNoPasswword;
  }

  async deleteUser(id: string): Promise<Omit<SafeUser, 'password'>> {
    const userId = await this.usersRepository.findOne({
      where: { id },
      relations: {
        orders: true,
      },
    });
    if (!userId)
      throw new NotFoundException(`Usuario con id: ${id}, no encontrado`);
    await this.usersRepository.remove(userId);
    const { password, isAdmin, ...userNoPasswword } = userId;
    return userNoPasswword;
  }

  async signUp(email: string) {
    const nUser = await this.usersRepository.findOne({ where: { email } });
  }

  async loginUserById(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }
}

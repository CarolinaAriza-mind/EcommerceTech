import { Injectable } from '@nestjs/common';
import { SafeUser, UsersRepository } from './users.repository';
import { Users } from './/entities/users.entity';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async getUsers(page: number, limit: number) {
    return await this.usersRepository.getUsers(page, limit);
  }

  async countUsers(): Promise<number> {
    return this.usersRepository.countUsers();
  }

  async getUserById(id: string): Promise<Omit<SafeUser, 'password'>> {
    return await this.usersRepository.getUser(id);
  }

  async getUserByEmail(email: string): Promise<Users | null> {
    return await this.usersRepository.loginUserById(email);
  }

  async upDateUser(
    id: string,
    user: UpdateUserDto,
  ): Promise<Omit<SafeUser, 'password'>> {
    return await this.usersRepository.upDateUser(id, user);
  }

  async deleteUser(id: string): Promise<Omit<SafeUser, 'password'>> {
    return await this.usersRepository.deleteUser(id);
  }
}

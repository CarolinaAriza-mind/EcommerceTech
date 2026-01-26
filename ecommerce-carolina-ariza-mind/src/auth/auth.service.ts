import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { SafeUser, UsersRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUser: CreateUserDto): Promise<Omit<SafeUser, 'password'>> {
    const { email, password, confirmPassword } = createUser;
    if (password !== confirmPassword) {
      throw new ConflictException('Las contraseñas no coinciden');
    }
    const existUser = await this.userService.getUserByEmail(email);
    if (existUser) {
      throw new ConflictException('El usuario ya está registrado');
    }
    const userCount = await this.userService.countUsers();
    const isAdmin = userCount === 0; // true solo para el primer usuario
    const hashPass = await bcrypt.hash(password, 10);
    const { confirmPassword: _, ...userData } = createUser;
    const user = await this.userRepository.addUser({
      ...userData,
      confirmPassword: hashPass,
      password: hashPass,
      isAdmin, // lo asignamos internamente, no viene del cliente
    });

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const { ...safeUser } = user;
    return safeUser;
  }

  async signIn(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Credenciales requeridas');
    }
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email o password no econtrados');
    }
    const passwordHash = await bcrypt.compare(password, user.password);
    if (!passwordHash) {
      throw new UnauthorizedException('Email o password no econtrados');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    if (!user?.id || !user?.email) {
      throw new InternalServerErrorException(
        'Usuario creado sin datos suficientes',
      );
    }
    const { password: _, isAdmin, ...userWithoutPassword } = user;

    return {
      message: 'Inicio de Sesion exitosa',
      user: userWithoutPassword,
      accessToken,
    };
  }
}

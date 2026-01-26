import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogginUserDto } from 'src/auth/dto/LogginUser.dto';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SafeUser } from 'src/users/users.repository';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registro de un usuario nuevo' })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({ status: 201, description: 'Registro de usuario exitoso!' })
  @ApiResponse({ status: 400, description: 'Fallo registro de usuario' })
  @ApiResponse({
    status: 404,
    description: 'Datos requeridos no encontrados',
  })
  @Post('signup')
  async signUp(
    @Body() createUser: CreateUserDto,
  ): Promise<Omit<SafeUser, 'password'>> {
    return await this.authService.signUp(createUser);
  }

  @ApiOperation({ summary: 'Inicio de sesion de un usuario registrado' })
  @ApiBody({
    type: LogginUserDto,
  })
  @ApiResponse({ status: 200, description: 'Sesion iniciada con exito!' })
  @ApiResponse({ status: 400, description: 'Fallo inicio de sesion' })
  @ApiResponse({ status: 404, description: 'Datos requeridos no encontrados' })
  @HttpCode(200)
  @Post('signin')
  async signIn(@Body() credentials: LogginUserDto) {
    const { email, password } = credentials;
    return await this.authService.signIn(email, password);
  }
}

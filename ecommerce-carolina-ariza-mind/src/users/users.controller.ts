import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { Role } from 'src/auth/roles/roles.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SafeUser } from './users.repository';
import type { AuthRequest } from 'src/Interface/jwtInterface';
import { CreateUserDto } from './dto/CreateUser.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersServices: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Solicitud de todos los usuarios registrados' })
  @ApiResponse({ status: 200, description: 'Usuarios solicitados' })
  @ApiResponse({
    status: 401,
    description: 'Falta token',
  })
  @ApiResponse({
    status: 403,
    description: 'Solicitud denegada: solo administradores',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuarios no encontrados',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Numero de pagina',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: 'Elementos por pagina',
  })
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async getUsers(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const validPage = !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;
    const validLimit = !isNaN(limitNum) && limitNum > 0 ? limitNum : 5;
    return await this.usersServices.getUsers(validPage, validLimit);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar un usuario por Id' })
  @ApiParam({ name: 'id', description: 'Id del usuario solicitado' })
  @ApiResponse({ status: 200, description: 'Usuario solicitado' })
  @ApiResponse({
    status: 403,
    description: 'Fallo solicitud del usuario, solo administradores',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ): Promise<Omit<SafeUser, 'password'>> {
    if (!req.user.isAdmin && req.user.sub !== id) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a los datos de otro usuario',
      );
    }
    return await this.usersServices.getUserById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar un usuario por Id, para modificar sus datos',
  })
  @ApiParam({ name: 'id', description: 'Id del usuario a modificar' })
  @ApiResponse({ status: 200, description: 'Usuario modificado con exito' })
  @ApiResponse({
    status: 403,
    description: 'No estas autorizado para modificar a este usuario',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @Put(':id')
  @UseGuards(AuthGuard)
  upDateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: UpdateUserDto,
    @Req() req: AuthRequest,
  ): Promise<Omit<SafeUser, 'password'>> {
    if (!req.user.isAdmin && req.user.sub !== id) {
      throw new ForbiddenException(
        'No tienes permiso para modificar este usuario',
      );
    }
    return this.usersServices.upDateUser(id, user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar un usuario por Id, para borrarlo de la base de datos',
  })
  @ApiParam({ name: 'id', description: 'Id del usuario a eliminar' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado con exito' })
  @ApiResponse({
    status: 403,
    description: 'No tienes permiso para eliminar este usuario ',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ): Promise<Omit<SafeUser, 'password'>> {
    if (!req.user.isAdmin && req.user.sub !== id) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este usuario',
      );
    }
    return await this.usersServices.deleteUser(id);
  }
}

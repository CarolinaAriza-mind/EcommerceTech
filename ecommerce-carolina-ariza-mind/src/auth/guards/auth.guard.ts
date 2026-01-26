import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwtInterfaces';
import { environment } from 'src/config/enviroment.dev';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const [type, token] = authHeader.split(' ');
    if (type != 'Bearer' || !token) {
      throw new UnauthorizedException('El token no es correcto');
    }

    try {
      const secret = environment.JWT_SECRET;
      if (!secret) {
        throw new UnauthorizedException(
          'Error interno: clave secreta no configurada',
        );
      }
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });
      const expDate = new Date(payload.exp * 1000);

      request['user'] = {
        ...payload,
        expReadable: expDate.toLocaleString('es-AR'),
        expDate,
      };
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido');
      } else {
        throw new UnauthorizedException('Error al validar el token');
      }
    }
  }
}

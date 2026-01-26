import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderResponse } from './interfaces/order.types';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { CreateOrderResponseDto } from './dto/CreateOrderResponse.dto';
import type { AuthRequest } from 'src/Interface/jwtInterface';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrdersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una orden nueva' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Orden creada con exito',
    type: CreateOrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Fallo creacion de orden',
  })
  @ApiResponse({
    status: 401,
    description: 'Falta token',
  })
  @ApiResponse({
    status: 403,
    description: 'No puedes agregar ordenes para este usuario',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontro el usuario',
  })
  @Post()
  @UseGuards(AuthGuard)
  async addOrder(
    @Body() body: CreateOrderDto,
    @Req() req: AuthRequest,
  ): Promise<CreateOrderResponse> {
    const { userId, products } = body;
    const logginUserId = req.user.sub;
    if (!logginUserId) {
      throw new ForbiddenException('El Id de usuario logueado no existe');
    }
    return await this.orderService.addOrders(userId, products, logginUserId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Solicitar una orden por su Id' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud de Orden por Id exitosa',
    type: CreateOrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Fallo solicitud de orden',
    type: CreateOrderResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Falta token',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo puedes acceder a tus ordenes',
  })
  @ApiResponse({ status: 404, description: 'No se encontro la orden' })
  @ApiParam({ name: 'id', description: 'Solicitud de orden por Id' })
  @Get(':id')
  @UseGuards(AuthGuard)
  async getOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ) {
    if (!req.user.isAdmin && req.user.sub !== id) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a esta orden, ya que corresponde a otro usuario o no existe',
      );
    }
    return await this.orderService.getOrder(id);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(id);
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Solicitud de levantamiento de la aplicacion' })
  @ApiResponse({ description: 'Aplicacion levantada con exito' })
  @Get()
  openApi() {
    return 'Ecommerce levantado!';
  }
}

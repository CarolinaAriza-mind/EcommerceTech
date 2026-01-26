import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Users } from '../entities/users.entity';
import { IsEmpty, IsNumber, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsString()
  @Length(3, 80, {
    message: 'Debe contener minimo 3 carateres y un maximo de 80 caracteres',
  })
  @ApiProperty({
    description:
      'La direccion debe ser un string, es obligatoria, y debe contener al menos 3 caracteres y no mas de 80. Esta informacion es obligatoria',
    example: 'Calle 2 n° 1234',
  })
  address: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'El numero de telefono debe ser un numero valido' })
  @ApiProperty({
    description:
      'Debe ser un numero valido y es obligatorio proporcionar esta info ',
    example: 12345678,
  })
  phone: number;

  @IsString()
  @Length(5, 50, {
    message:
      'El nombre del pais debe contener al menos 5 caracteres y un maximo de 20 caracteres',
  })
  @ApiProperty({
    description:
      'Debe ser un string y debe contener al menos 5 caracteres y no mas de 20',
    example: 'Argentina',
  })
  country: string;

  @IsString()
  @Length(5, 50, {
    message:
      'El nombre del pais debe contener al menos 5 caracteres y un maximo de 20 caracteres',
  })
  @ApiProperty({
    description:
      'Debe ser un string y debe contener al menos 5 caracteres y no mas de 20',
    example: 'Trelew',
  })
  city: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class LogginUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty({ message: 'El email es requerido' })
  @ApiProperty({
    description:
      'El email es un string, debe ser een formato de email y es obligatorio',
    example: 'Caro@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
    message:
      'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y uno de los siguientes caracteres especiales: !@#$%^&*',
  })
  @Length(8, 15, {
    message:
      'La contraseña debe contener minimo 8 caracteres y un maximo de 15 caracteres',
  })
  @ApiProperty({
    description:
      'La contraseña debe ser un string,  es obligatoria y debe contener al menos: una letra mayusucla, una letra miniscula, un numero y uno de los siguientes caracteres especiales: !@#$%^&. Tambien debe contener un minim de 8 caracteres y un maximo de 15 caracteres ',
    example: 'Abcd**12',
  })
  password: string;

  @ApiProperty({
    description: 'JWT',
  })
  accessToken: string;
}

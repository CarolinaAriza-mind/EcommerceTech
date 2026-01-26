import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'el nombre es obligatorio' })
  @Length(3, 80, {
    message:
      'El nombre debe contener minimos 3 caracteres y un maximo de 80 caracteres',
  })
  @ApiProperty({
    description:
      'El nombre es obligatorio y debe contener minimos 3 caracteres y un maximo de 80 caracteres',
    example: 'Carolina',
  })
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @ApiProperty({
    description: 'El email es obligatorio y debe contener formato de email',
    example: 'Caro@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
    message:
      'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y uno de los siguientes caracteres especiales: !@#$%^&*',
  })
  @Length(8, 50, {
    message:
      'La contraseña debe contener minimo 8 caracteres y un maximo de 15 caracteres',
  })
  @ApiProperty({
    description:
      'La contraseña debe ser un string,  es obligatoria y debe contener al menos: una letra mayusucla, una letra miniscula, un numero y uno de los siguientes caracteres especiales: !@#$%^&. Tambien debe contener un minim de 8 caracteres y un maximo de 15 caracteres ',
    example: 'Abcd**12',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'La confirmacion de contraseña es obligatoria' })
  @Length(8, 100)
  @ApiProperty({
    description:
      'Es obligatoria, debe ser un string y es la confirmacion de la contraseña',
    example: 'Abcd**12',
  })
  confirmPassword: string;

  @IsEmpty()
  @Exclude()
  @ApiHideProperty()
  isAdmin: boolean;

  @IsString()
  @IsNotEmpty({ message: 'La direccion es obligatoria' })
  @Length(3, 80, {
    message: 'Debe contener minimo 3 carateres y un maximo de 80 caracteres',
  })
  @ApiProperty({
    description:
      'La direccion debe ser un string, es obligatoria, y debe contener al menos 3 caracteres y no mas de 80. Esta informacion es obligatoria',
    example: 'Calle 2 n° 1234',
  })
  address: string;

  @IsNotEmpty({ message: 'El numero de telefono es obligatorio' })
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

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class CloudinaryDto {
  @ApiProperty({
    description: 'ID del producto',
    example: 'df2634da-f28c-46f2-bffd-bb064c388640',
  })
  @IsString()
  productId: string;

  @IsString()
  @IsUrl()
  @ApiProperty({
    description: 'Debe ser un enlace de imagen del producto, de tipo string',
    example: 'https://www.shutterstock.com/image-vector/d',
  })
  imgURL: string;
}

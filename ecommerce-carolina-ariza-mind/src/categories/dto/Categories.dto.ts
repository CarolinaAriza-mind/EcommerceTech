import { ApiProperty } from '@nestjs/swagger';

export class CategoriesDto {
  @ApiProperty({
    description: 'Id con formato uuid',
    example: 'df2634da-f28c-46f2-bffd-bb064c388640',
  })
  id: string;

  @ApiProperty({
    description:
      'El nombre de la categoria es obligatorio, de tipo string y no puede contener mas e 50 caracteres',
    example: 'mouse',
  })
  name: string;
}

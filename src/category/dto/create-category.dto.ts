import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @IsInt()
  @IsOptional()
  categoriaPaiId?: number;
}

import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsInt()
  @Type(() => Number)
  lojaId: number;

  @IsInt()
  @Type(() => Number)
  categoriaId: number;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsInt()
  @Type(() => Number)
  preco: number; // Armazenar como centavos

  @IsInt()
  @Type(() => Number)
  estoque: number;
}
import { IsNotEmpty, IsString, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class CreateProductImageDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  alt_text?: string;
}

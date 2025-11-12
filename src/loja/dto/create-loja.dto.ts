import { IsString, IsOptional } from 'class-validator';

export class CreateLojaDto {
  @IsString()
  nome: string;

  @IsString()
  @IsOptional() 
  descricao?: string; 

  @IsString()
  @IsOptional()
  logo_url?: string;

  @IsString()
  @IsOptional()
  banner_url?: string;

  @IsString()
  @IsOptional()
  sticker_url?: string;
}
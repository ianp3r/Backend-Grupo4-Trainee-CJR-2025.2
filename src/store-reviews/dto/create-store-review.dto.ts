import {
  IsInt,
  IsOptional,
  IsString,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';

export class CreateStoreReviewDto {
  @IsInt()
  @IsNotEmpty()
  usuarioId: number;

  @IsInt()
  @IsNotEmpty()
  lojaId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  nota: number;

  @IsString()
  @IsOptional()
  comentario?: string;
}

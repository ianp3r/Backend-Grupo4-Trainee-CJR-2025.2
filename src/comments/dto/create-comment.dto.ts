import { IsInt, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  @IsNotEmpty()
  usuarioId: number;

  @IsInt()
  @IsOptional()
  avaliacaoId?: number;

  @IsInt()
  @IsOptional()
  avaliacaoProdutoId?: number;

  @IsString()
  @IsOptional()
  conteudo?: string;
}

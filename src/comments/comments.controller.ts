import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// http://localhost:3000/comments
@Controller('comments')
@UseGuards(JwtAuthGuard) // <-- PROTEGE TODOS OS ENDPOINTS DO CONTROLLER
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * Endpoint para criar um novo comentário
   * POST /comments
   */
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  /**
   * Endpoint para listar todos os comentários
   * GET /comments
   *
   * Query params opcionais:
   * - avaliacaoId: filtra comentários por avaliação de loja
   * - avaliacaoProdutoId: filtra comentários por avaliação de produto
   */
  @Get()
  findAll(
    @Query('avaliacaoId', new ParseIntPipe({ optional: true }))
    avaliacaoId?: number,
    @Query('avaliacaoProdutoId', new ParseIntPipe({ optional: true }))
    avaliacaoProdutoId?: number,
  ) {
    if (avaliacaoId) {
      return this.commentsService.findByStoreReview(avaliacaoId);
    }
    if (avaliacaoProdutoId) {
      return this.commentsService.findByProductReview(avaliacaoProdutoId);
    }
    return this.commentsService.findAll();
  }

  /**
   * Endpoint para buscar um comentário pelo ID
   * GET /comments/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  /**
   * Endpoint para atualizar um comentário pelo ID
   * PATCH /comments/:id
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, updateCommentDto);
  }

  /**
   * Endpoint para deletar um comentário pelo ID
   * DELETE /comments/:id
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}

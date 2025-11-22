import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ReviewComment } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo comentário de avaliação
   */
  async create(createCommentDto: CreateCommentDto): Promise<ReviewComment> {
    return this.prisma.reviewComment.create({
      data: createCommentDto,
      include: {
        usuario: {
          select: {
            id: true,
            username: true,
            nome: true,
            email: true,
            foto_perfil_url: true,
          },
        },
        avaliacao_loja: true,
        avaliacao_produto: true,
      },
    });
  }

  /**
   * Retorna todos os comentários
   */
  async findAll(): Promise<ReviewComment[]> {
    return this.prisma.reviewComment.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            username: true,
            nome: true,
            email: true,
            foto_perfil_url: true,
          },
        },
        avaliacao_loja: true,
        avaliacao_produto: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Retorna um comentário específico pelo ID
   */
  async findOne(id: number): Promise<ReviewComment> {
    const comment = await this.prisma.reviewComment.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            username: true,
            nome: true,
            email: true,
            foto_perfil_url: true,
          },
        },
        avaliacao_loja: true,
        avaliacao_produto: true,
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comentário com ID ${id} não encontrado`);
    }

    return comment;
  }

  /**
   * Retorna todos os comentários de uma avaliação de loja
   */
  async findByStoreReview(avaliacaoId: number): Promise<ReviewComment[]> {
    return this.prisma.reviewComment.findMany({
      where: { avaliacaoId },
      include: {
        usuario: {
          select: {
            id: true,
            username: true,
            nome: true,
            email: true,
            foto_perfil_url: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Retorna todos os comentários de uma avaliação de produto
   */
  async findByProductReview(
    avaliacaoProdutoId: number,
  ): Promise<ReviewComment[]> {
    return this.prisma.reviewComment.findMany({
      where: { avaliacaoProdutoId },
      include: {
        usuario: {
          select: {
            id: true,
            username: true,
            nome: true,
            email: true,
            foto_perfil_url: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Atualiza um comentário pelo ID
   */
  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<ReviewComment> {
    // Verifica se o comentário existe
    await this.findOne(id);

    return this.prisma.reviewComment.update({
      where: { id },
      data: updateCommentDto,
      include: {
        usuario: {
          select: {
            id: true,
            username: true,
            nome: true,
            email: true,
            foto_perfil_url: true,
          },
        },
        avaliacao_loja: true,
        avaliacao_produto: true,
      },
    });
  }

  /**
   * Remove um comentário pelo ID
   */
  async remove(id: number): Promise<ReviewComment> {
    // Verifica se o comentário existe
    await this.findOne(id);

    return this.prisma.reviewComment.delete({
      where: { id },
    });
  }
}

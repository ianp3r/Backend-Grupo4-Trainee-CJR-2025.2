import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreReviewDto } from './dto/create-store-review.dto';
import { UpdateStoreReviewDto } from './dto/update-store-review.dto';
import { StoreReview } from '@prisma/client';

@Injectable()
export class StoreReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova avaliação de loja
   */
  async create(
    createStoreReviewDto: CreateStoreReviewDto,
  ): Promise<StoreReview> {
    return this.prisma.storeReview.create({
      data: createStoreReviewDto,
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
        loja: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            logo_url: true,
          },
        },
        comentarios: true,
      },
    });
  }

  /**
   * Retorna todas as avaliações de loja
   * Pode filtrar por lojaId opcionalmente
   */
  async findAll(lojaId?: number): Promise<StoreReview[]> {
    return this.prisma.storeReview.findMany({
      where: lojaId ? { lojaId } : undefined,
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
        loja: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            logo_url: true,
          },
        },
        comentarios: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Retorna uma avaliação de loja específica pelo ID
   */
  async findOne(id: number): Promise<StoreReview> {
    const storeReview = await this.prisma.storeReview.findUnique({
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
        loja: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            logo_url: true,
          },
        },
        comentarios: {
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
        },
      },
    });

    if (!storeReview) {
      throw new NotFoundException(
        `Avaliação de loja com ID ${id} não encontrada`,
      );
    }

    return storeReview;
  }

  /**
   * Atualiza uma avaliação de loja pelo ID
   */
  async update(
    id: number,
    updateStoreReviewDto: UpdateStoreReviewDto,
  ): Promise<StoreReview> {
    // Verifica se a avaliação existe
    await this.findOne(id);

    return this.prisma.storeReview.update({
      where: { id },
      data: updateStoreReviewDto,
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
        loja: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            logo_url: true,
          },
        },
        comentarios: true,
      },
    });
  }

  /**
   * Remove uma avaliação de loja pelo ID
   */
  async remove(id: number): Promise<StoreReview> {
    // Verifica se a avaliação existe
    await this.findOne(id);

    return this.prisma.storeReview.delete({
      where: { id },
    });
  }
}

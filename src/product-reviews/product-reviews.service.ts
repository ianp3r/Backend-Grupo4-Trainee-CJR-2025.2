import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { ProductReview } from '@prisma/client';

@Injectable()
export class ProductReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova avaliação de produto
   */
  async create(
    createProductReviewDto: CreateProductReviewDto,
  ): Promise<ProductReview> {
    return this.prisma.productReview.create({
      data: createProductReviewDto,
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
        produto: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            preco: true,
            loja: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
        comentarios: true,
      },
    });
  }

  /**
   * Retorna todas as avaliações de produto
   * Pode filtrar por produtoId opcionalmente
   */
  async findAll(produtoId?: number): Promise<ProductReview[]> {
    return this.prisma.productReview.findMany({
      where: produtoId ? { produtoId } : undefined,
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
        produto: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            preco: true,
            loja: {
              select: {
                id: true,
                nome: true,
              },
            },
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
   * Retorna uma avaliação de produto específica pelo ID
   */
  async findOne(id: number): Promise<ProductReview> {
    const productReview = await this.prisma.productReview.findUnique({
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
        produto: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            preco: true,
            loja: {
              select: {
                id: true,
                nome: true,
              },
            },
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

    if (!productReview) {
      throw new NotFoundException(
        `Avaliação de produto com ID ${id} não encontrada`,
      );
    }

    return productReview;
  }

  /**
   * Atualiza uma avaliação de produto pelo ID
   */
  async update(
    id: number,
    updateProductReviewDto: UpdateProductReviewDto,
  ): Promise<ProductReview> {
    // Verifica se a avaliação existe
    await this.findOne(id);

    return this.prisma.productReview.update({
      where: { id },
      data: updateProductReviewDto,
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
        produto: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            preco: true,
            loja: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
        comentarios: true,
      },
    });
  }

  /**
   * Remove uma avaliação de produto pelo ID
   */
  async remove(id: number): Promise<ProductReview> {
    // Verifica se a avaliação existe
    await this.findOne(id);

    return this.prisma.productReview.delete({
      where: { id },
    });
  }
}

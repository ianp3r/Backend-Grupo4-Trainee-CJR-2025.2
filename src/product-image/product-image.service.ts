import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductImageService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova imagem de produto
   */
  async create(createProductImageDto: CreateProductImageDto) {
    const productExists = await this.prisma.product.findUnique({
      where: { id: createProductImageDto.productId },
    });

    if (!productExists) {
      throw new BadRequestException(
        `Produto com ID ${createProductImageDto.productId} não existe.`,
      );
    }

    try {
      return await this.prisma.productImage.create({
        data: createProductImageDto,
        include: {
          product: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retorna uma lista de todas as imagens de produtos
   */
  async findAll() {
    return this.prisma.productImage.findMany({
      include: {
        product: true,
      },
    });
  }

  /**
   * Busca uma imagem de produto específica pelo ID
   */
  async findOne(id: number) {
    const image = await this.prisma.productImage.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!image) {
      throw new NotFoundException(`Imagem de produto com ID ${id} não encontrada.`);
    }

    return image;
  }

  /**
   * Busca todas as imagens de um produto específico
   */
  async findByProduct(productId: number) {
    const productExists = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productExists) {
      throw new BadRequestException(
        `Produto com ID ${productId} não existe.`,
      );
    }

    return this.prisma.productImage.findMany({
      where: { productId },
      include: {
        product: true,
      },
    });
  }

  /**
   * Atualiza uma imagem de produto
   */
  async update(
    id: number,
    updateProductImageDto: UpdateProductImageDto,
  ) {
    // Se está mudando o produto, verifica se ele existe
    if (updateProductImageDto.productId) {
      const productExists = await this.prisma.product.findUnique({
        where: { id: updateProductImageDto.productId },
      });

      if (!productExists) {
        throw new BadRequestException(
          `Produto com ID ${updateProductImageDto.productId} não existe.`,
        );
      }
    }

    try {
      return await this.prisma.productImage.update({
        where: { id },
        data: updateProductImageDto,
        include: {
          product: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Imagem de produto com ID ${id} não encontrada.`,
          );
        }
      }
      throw error;
    }
  }

  /**
   * Remove uma imagem de produto
   */
  async remove(id: number) {
    try {
      return await this.prisma.productImage.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Imagem de produto com ID ${id} não encontrada.`,
          );
        }
      }
      throw error;
    }
  }
}

import {
  Injectable,
  NotFoundException,
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
    try {
      const db = this.prisma as any;
      return await db.productImage.create({
        data: createProductImageDto,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retorna uma lista de todas as imagens de produtos
   */
  async findAll() {
  const db = this.prisma as any;
  return db.productImage.findMany();
  }

  /**
   * Busca uma imagem de produto específica pelo ID
   */
  async findOne(id: number) {
    const db = this.prisma as any;
    const image = await db.productImage.findUnique({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException(
        `Imagem de produto com ID ${id} não encontrada.`,
      );
    }

    return image;
  }

  /**
   * Atualiza uma imagem de produto
   */
  async update(id: number, updateProductImageDto: UpdateProductImageDto) {
    try {
      const db = this.prisma as any;
      return await db.productImage.update({
        where: { id },
        data: updateProductImageDto,
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
      const db = this.prisma as any;
      return await db.productImage.delete({
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

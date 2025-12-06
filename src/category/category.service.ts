import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova categoria de produto
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<any> {
    try {
      const db = this.prisma as any;
      return await db.productCategory.create({
        data: createCategoryDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[];
          throw new ConflictException(
            `O campo ${target.join(', ')} já está em uso.`,
          );
        }
      }
      throw error;
    }
  }

  /**
   * Retorna uma lista de todas as categorias
   */
  async findAll(): Promise<any[]> {
    const db = this.prisma as any;
    return db.productCategory.findMany({
      include: {
        products: true,
      },
    });
  }

  /**
   * Busca uma categoria específica pelo ID
   */
  async findOne(id: number): Promise<any> {
    const db = this.prisma as any;
    const category = await db.productCategory.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException(
        `Categoria de produto com ID ${id} não encontrada.`,
      );
    }

    return category;
  }
  
  /**
   * Atualiza uma categoria de produto
   */
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<any> {
    try {
      const db = this.prisma as any;
      return await db.productCategory.update({
        where: { id },
        data: updateCategoryDto,
        include: {
          products: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Categoria de produto com ID ${id} não encontrada.`,
          );
        }
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[];
          throw new ConflictException(
            `O campo ${target.join(', ')} já está em uso.`,
          );
        }
      }
      throw error;
    }
  }

  /**
   * Remove uma categoria de produto
   */
  async remove(id: number): Promise<any> {
    try {
      const db = this.prisma as any;
      return await db.productCategory.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Categoria de produto com ID ${id} não encontrada.`,
          );
        }
      }
      throw error;
    }
  }
}

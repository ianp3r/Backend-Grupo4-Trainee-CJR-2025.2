import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LojaService {
  constructor(private prisma: PrismaService) {}

  async create(createLojaDto: CreateLojaDto, userId: number) {
    try {
      // Verify user exists
      const userExists = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return await this.prisma.store.create({
        data: {
          ...createLojaDto,
          usuarioId: userId,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(
          'Invalid data provided for store creation',
        );
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.store.findMany();
  }

  findByUserId(userId: number) {
    return this.prisma.store.findMany({
      where: { usuarioId: userId },
      include: {
        produtos: {
          include: {
            imagens: true,
            categoria: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.store.findUnique({
      where: { id: +id },
    });
  }

  update(id: number, updateLojaDto: UpdateLojaDto) {
    return this.prisma.store.update({
      where: { id: +id },
      data: updateLojaDto,
    });
  }

  remove(id: number) {
    return this.prisma.store.delete({
      where: { id: +id },
    });
  }
}

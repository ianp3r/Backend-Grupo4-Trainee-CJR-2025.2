import { Injectable } from '@nestjs/common';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LojaService {
  constructor(private prisma: PrismaService) {}

  create(createLojaDto: CreateLojaDto, userId: number) {
    return this.prisma.store.create({
      data: {
        ...createLojaDto,
        usuarioId: userId,
      },
    });
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

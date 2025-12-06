import { Injectable } from '@nestjs/common';
import { ProdutoDto } from './dto/produto.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) {}
  async create(data: ProdutoDto) {
    const { id, ...createData } = data;
    const produto = await this.prisma.produto.create({ data: createData });

    return produto;
  }

  async findAll() {
    return await this.prisma.produto.findMany();
  }

  async update(id: number, data: ProdutoDto) {
    const produtoExists = await this.prisma.produto.findUnique({
      where: { id },
    });

    if (!produtoExists) {
      throw new Error('Produto não encontrado');
    }

    const { id: _, ...updateData } = data;
    return await this.prisma.produto.update({
      data: updateData,
      where: { id },
    });
  }

  async delete(id: number) {
    const produtoExists = await this.prisma.produto.findUnique({
      where: { id },
    });

    if (!produtoExists) {
      throw new Error('Produto não encontrado');
    }

    return await this.prisma.produto.delete({ where: { id } });
  }

  async getById(id: number) {
    const produtoExists = await this.prisma.produto.findUnique({
      where: { id },
    });

    if (!produtoExists) {
      throw new Error('Produto não encontrado');
    }
    return produtoExists;
  }
}

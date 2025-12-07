import { Injectable } from '@nestjs/common';
import { ProdutoDto } from './dto/produto.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) {}
  async create(data: ProdutoDto) {
    const { id, categoriaId, createdAt, updatedAt, ...createData } = data;
    
    // Validate that the store exists
    const storeExists = await this.prisma.store.findUnique({
      where: { id: createData.lojaId },
    });

    if (!storeExists) {
      throw new Error(`Loja com ID ${createData.lojaId} não encontrada`);
    }

    // Validate that the category exists if provided
    if (categoriaId) {
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: categoriaId },
      });

      if (!categoryExists) {
        throw new Error(`Categoria com ID ${categoriaId} não encontrada`);
      }
    }

    // Build the data object, only including categoriaId if it's provided
    const dataToCreate: any = createData;
    if (categoriaId) {
      dataToCreate.categoriaId = categoriaId;
    }

    const produto = await this.prisma.produto.create({ 
      data: dataToCreate
    });

    return produto;
  }

  async findAll() {
    return await this.prisma.produto.findMany({
      include: {
        loja: true,
        categoria: true,
        imagens: true,
      },
    });
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
      include: {
        loja: true,
        categoria: true,
        imagens: true,
        avaliacoes: {
          include: {
            usuario: true,
          },
        },
      },
    });

    if (!produtoExists) {
      throw new Error('Produto não encontrado');
    }
    return produtoExists;
  }
}

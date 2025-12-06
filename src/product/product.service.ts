import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const productInclude = {
  loja: {
    select: {
      id: true,
      nome: true,
    },
  },
  categoria: {
    select: {
      id: true,
      nome: true,
    },
  },
  imagens: {
    select: {
      id: true,
      url: true,
      alt_text: true,
    },
  },
};

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria um novo produto
   */
  async create(createProductDto: CreateProductDto) {
    return await this.prisma.produto.create({
      data: createProductDto,
      include: {
        loja: {
          select: {
            id: true,
            nome: true,
          },
        },
        categoria: {
          select: {
            id: true,
            nome: true,
          },
        },
        imagens: {
          select: {
            id: true,
            url: true,
            alt_text: true,
          },
        },
      },
    });
  }

  /**
   * Busca todos os produtos
   */
  async findAll() {
    return await this.prisma.produto.findMany({
      include: {
        loja: {
          select: {
            id: true,
            nome: true,
          },
        },
        categoria: {
          select: {
            id: true,
            nome: true,
          },
        },
        imagens: {
          select: {
            id: true,
            url: true,
            alt_text: true,
          },
        },
      },
    });
  }

  /**
   * Busca produtos por categoria
   */
  async findByCategory(categoriaId: number) {
    return await this.prisma.produto.findMany({
      where: {
        categoriaId: categoriaId,
      },
      include: {
        loja: {
          select: {
            id: true,
            nome: true,
          },
        },
        categoria: {
          select: {
            id: true,
            nome: true,
          },
        },
        imagens: {
          select: {
            id: true,
            url: true,
            alt_text: true,
          },
        },
      },
    });
  }

  /**
   * Busca produtos por loja
   */
  async findByStore(lojaId: number) {
    return await this.prisma.produto.findMany({
      where: {
        lojaId: lojaId,
      },
      include: {
        loja: {
          select: {
            id: true,
            nome: true,
          },
        },
        categoria: {
          select: {
            id: true,
            nome: true,
          },
        },
        imagens: {
          select: {
            id: true,
            url: true,
            alt_text: true,
          },
        },
      },
    });
  }

  /**
   * Busca um produto pelo ID
   */
  async findOne(id: number) {
    const product = await this.prisma.produto.findUnique({
      where: { id },
      include: {
        loja: {
          select: {
            id: true,
            nome: true,
          },
        },
        categoria: {
          select: {
            id: true,
            nome: true,
          },
        },
        imagens: {
          select: {
            id: true,
            url: true,
            alt_text: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return product;
  }

  /**
   * Atualiza um produto
   */
  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.produto.update({
      where: { id },
      data: updateProductDto,
      include: {
        loja: {
          select: {
            id: true,
            nome: true,
          },
        },
        categoria: {
          select: {
            id: true,
            nome: true,
          },
        },
        imagens: {
          select: {
            id: true,
            url: true,
            alt_text: true,
          },
        },
      },
    });
  }

  /**
   * Remove um produto
   */
  async remove(id: number) {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.produto.delete({
      where: { id },
    });
  }
}

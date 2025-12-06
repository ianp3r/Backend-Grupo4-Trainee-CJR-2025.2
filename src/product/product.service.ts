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
      url_imagem: true,
      ordem: true,
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
    return await this.prisma.product.create({
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
            url_imagem: true,
            ordem: true,
          },
        },
      },
    });
  }

  /**
   * Busca todos os produtos
   */
  async findAll() {
    return await this.prisma.product.findMany({
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
            url_imagem: true,
            ordem: true,
          },
        },
      },
    });
  }

  /**
   * Busca produtos por categoria
   */
  async findByCategory(categoriaId: number) {
    return await this.prisma.product.findMany({
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
            url_imagem: true,
            ordem: true,
          },
        },
      },
    });
  }

  /**
   * Busca produtos por loja
   */
  async findByStore(lojaId: number) {
    return await this.prisma.product.findMany({
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
            url_imagem: true,
            ordem: true,
          },
        },
      },
    });
  }

  /**
   * Busca um produto pelo ID
   */
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
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
            url_imagem: true,
            ordem: true,
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

    return await this.prisma.product.update({
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
            url_imagem: true,
            ordem: true,
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

    return await this.prisma.product.delete({
      where: { id },
    });
  }
}

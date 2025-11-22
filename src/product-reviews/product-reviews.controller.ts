import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductReviewsService } from './product-reviews.service';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// http://localhost:3000/product-reviews
@Controller('product-reviews')
export class ProductReviewsController {
  constructor(private readonly productReviewsService: ProductReviewsService) {}

  /**
   * Endpoint para criar uma nova avaliação de produto
   * POST /product-reviews
   * Requer autenticação
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProductReviewDto: CreateProductReviewDto) {
    return this.productReviewsService.create(createProductReviewDto);
  }

  /**
   * Endpoint para listar todas as avaliações de produto
   * GET /product-reviews
   * Acesso público (não requer autenticação)
   *
   * Query params opcionais:
   * - produtoId: filtra avaliações por produto
   */
  @Get()
  findAll(
    @Query('produtoId', new ParseIntPipe({ optional: true }))
    produtoId?: number,
  ) {
    return this.productReviewsService.findAll(produtoId);
  }

  /**
   * Endpoint para buscar uma avaliação de produto pelo ID
   * GET /product-reviews/:id
   * Acesso público (não requer autenticação)
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productReviewsService.findOne(id);
  }

  /**
   * Endpoint para atualizar uma avaliação de produto pelo ID
   * PATCH /product-reviews/:id
   * Requer autenticação
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductReviewDto: UpdateProductReviewDto,
  ) {
    return this.productReviewsService.update(id, updateProductReviewDto);
  }

  /**
   * Endpoint para deletar uma avaliação de produto pelo ID
   * DELETE /product-reviews/:id
   * Requer autenticação
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productReviewsService.remove(id);
  }
}

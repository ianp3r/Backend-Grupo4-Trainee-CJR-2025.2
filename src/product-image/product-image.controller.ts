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
} from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('product-images')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  /**
   * Cria uma nova imagem de produto
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProductImageDto: CreateProductImageDto) {
    return this.productImageService.create(createProductImageDto);
  }

  /**
   * Lista todas as imagens de produtos
   */
  @Get()
  findAll() {
    return this.productImageService.findAll();
  }

  /**
   * Busca uma imagem de produto pelo ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productImageService.findOne(id);
  }

  /**
   * Atualiza uma imagem de produto
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductImageDto: UpdateProductImageDto,
  ) {
    return this.productImageService.update(id, updateProductImageDto);
  }

  /**
   * Remove uma imagem de produto
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productImageService.remove(id);
  }
}

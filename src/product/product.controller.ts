import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body(ValidationPipe) createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('categoria') categoriaId?: string,
    @Query('loja') lojaId?: string,
  ) {
    if (categoriaId) {
      return this.productService.findByCategory(parseInt(categoriaId));
    }
    if (lojaId) {
      return this.productService.findByStore(parseInt(lojaId));
    }
    return this.productService.findAll();
  }

  @Get('categoria/:categoriaId')
  findByCategory(@Param('categoriaId', ParseIntPipe) categoriaId: number) {
    return this.productService.findByCategory(categoriaId);
  }

  @Get('loja/:lojaId')
  findByStore(@Param('lojaId', ParseIntPipe) lojaId: number) {
    return this.productService.findByStore(lojaId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}

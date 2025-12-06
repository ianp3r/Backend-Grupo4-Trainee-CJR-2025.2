import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import type { ProdutoDto } from './dto/produto.dto';
import { ProdutoService } from './produto.service';

@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  async create(@Body() data: ProdutoDto) {
    return this.produtoService.create(data);
  }

  @Get()
  async findAll() {
    return this.produtoService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: ProdutoDto) {
    return this.produtoService.update(Number(id), data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.produtoService.delete(Number(id));
  }
  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.produtoService.getById(Number(id));
  }
}

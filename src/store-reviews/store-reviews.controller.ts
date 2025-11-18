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
import { StoreReviewsService } from './store-reviews.service';
import { CreateStoreReviewDto } from './dto/create-store-review.dto';
import { UpdateStoreReviewDto } from './dto/update-store-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// http://localhost:3000/store-reviews
@Controller('store-reviews')
export class StoreReviewsController {
  constructor(private readonly storeReviewsService: StoreReviewsService) {}

  /**
   * Endpoint para criar uma nova avaliação de loja
   * POST /store-reviews
   * Requer autenticação
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createStoreReviewDto: CreateStoreReviewDto) {
    return this.storeReviewsService.create(createStoreReviewDto);
  }

  /**
   * Endpoint para listar todas as avaliações de loja
   * GET /store-reviews
   * Acesso público (não requer autenticação)
   *
   * Query params opcionais:
   * - lojaId: filtra avaliações por loja
   */
  @Get()
  findAll(
    @Query('lojaId', new ParseIntPipe({ optional: true }))
    lojaId?: number,
  ) {
    return this.storeReviewsService.findAll(lojaId);
  }

  /**
   * Endpoint para buscar uma avaliação de loja pelo ID
   * GET /store-reviews/:id
   * Acesso público (não requer autenticação)
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storeReviewsService.findOne(id);
  }

  /**
   * Endpoint para atualizar uma avaliação de loja pelo ID
   * PATCH /store-reviews/:id
   * Requer autenticação
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStoreReviewDto: UpdateStoreReviewDto,
  ) {
    return this.storeReviewsService.update(id, updateStoreReviewDto);
  }

  /**
   * Endpoint para deletar uma avaliação de loja pelo ID
   * DELETE /store-reviews/:id
   * Requer autenticação
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.storeReviewsService.remove(id);
  }
}

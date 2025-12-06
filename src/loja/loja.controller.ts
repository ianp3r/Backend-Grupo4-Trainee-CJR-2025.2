import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LojaService } from './loja.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator';

@Controller('loja')
export class LojaController {
  constructor(private readonly lojaService: LojaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createLojaDto: CreateLojaDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.lojaService.create(createLojaDto, user.userId);
  }

  @Get()
  findAll() {
    return this.lojaService.findAll();
  }

  @Get('my-stores')
  @UseGuards(JwtAuthGuard)
  findMyStores(@CurrentUser() user: CurrentUserPayload) {
    return this.lojaService.findByUserId(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lojaService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateLojaDto: UpdateLojaDto) {
    return this.lojaService.update(+id, updateLojaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.lojaService.remove(+id);
  }
}

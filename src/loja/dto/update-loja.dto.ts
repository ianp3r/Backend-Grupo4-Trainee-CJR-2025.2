// src/loja/dto/update-loja.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateLojaDto } from './create-loja.dto';

// 'PartialType' pega todos os campos do CreateLojaDto
// e os torna opcionais. Perfeito para o update!
export class UpdateLojaDto extends PartialType(CreateLojaDto) {}
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService, SafeUser } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// http://localhost:3000/users
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
   * Endpoint para login de usuário
   * POST /users/login
   */
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }): Promise<SafeUser> {
    return this.userService.validateCredentials(loginDto.email, loginDto.password);
  }

  /**
   * endpoint para criação de usuario
   * POST /usuarios
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<SafeUser> {
    // O @Body() junto com o ValidationPipe (global) valida o DTO automaticamente
    return this.userService.create(createUserDto);
  }

  /**
   * endpoint para listar todos os usuarios
   * GET /usuarios
   */
  @Get()
  findAll(): Promise<SafeUser[]> {
    return this.userService.findAll();
  }

  /**
   * endpoint para buscar um usuario pelo id
   * GET /usuarios/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SafeUser> {
    // O 'ParseIntPipe' garante que o 'id' na URL é um número válido.
    // Se não for (ex: /usuarios/abc), ele retorna um erro 400.
    return this.userService.findOne(id);
  }

  /**
   * endpoint para atualizar um usuario pelo id
   * PATCH /usuarios/:id
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SafeUser> {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * endpoint para deletar um usuario pelo id
   * DELETE /usuarios/:id
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<SafeUser> {
    return this.userService.remove(id);
  }
}

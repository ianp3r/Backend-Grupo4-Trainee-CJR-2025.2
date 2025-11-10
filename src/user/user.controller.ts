import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService, SafeUser } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// http://localhost:3000/users
@Controller('users')
@UseGuards(JwtAuthGuard) // <-- PROTEGE TODOS OS ENDPOINTS DO CONTROLLER
export class UserController {
  constructor(private readonly userService: UserService) { }

  //
  // O ENDPOINT POST /users/login FOI REMOVIDO DAQUI
  //

  //
  // O ENDPOINT POST /users (create) FOI REMOVIDO DAQUI
  // O registro agora é feito via POST /auth/register
  //

  /**
   * endpoint para listar todos os usuarios
   * GET /users
   */
  @Get()
  findAll(): Promise<SafeUser[]> {
    return this.userService.findAll();
  }

  /**
   * endpoint para buscar um usuario pelo id
   * GET /users/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SafeUser> {
    return this.userService.findOne(id);
  }

  /**
   * endpoint para atualizar um usuario pelo id
   * PATCH /users/:id
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
   * DELETE /users/:id
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<SafeUser> {
    return this.userService.remove(id);
  }
}

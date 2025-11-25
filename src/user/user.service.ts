import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Tipo 'SafeUser' omite a senha
export type SafeUser = Omit<User, 'senha_hash'>;

// 'select' constante para não vazar a senha
const userSelectSafeData: Prisma.UserSelect = {
  id: true,
  username: true,
  nome: true,
  email: true,
  foto_perfil_url: true,
  createdAt: true,
  updatedAt: true,
};

// Este DTO agora é "interno", usado pelo AuthService
// Ele não espera 'password', mas sim 'senha_hash'
type InternalCreateUserDto = Omit<
  import('./dto/create-user.dto').CreateUserDto,
  'password'
> & {
  senha_hash: string;
};

@Injectable()
export class UserService {
  private readonly saltRounds = 10;

  constructor(private prisma: PrismaService) { }

  /**
   * Cria um novo usuário.
   * NÃO faz mais hash. Recebe o hash pronto do AuthService.
   */
  async create(data: InternalCreateUserDto): Promise<SafeUser> {
    try {
      const newUser = await this.prisma.user.create({
        data: data, // Salva o DTO diretamente (já contém senha_hash)
        select: userSelectSafeData,
      });

      return newUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[];
          throw new ConflictException(
            `O campo ${target.join(', ')} já está em uso.`,
          );
        }
      }
      throw error;
    }
  }

  /**
   * Retorna uma lista de todos os usuários.
   */
  async findAll(): Promise<SafeUser[]> {
    return this.prisma.user.findMany({
      select: userSelectSafeData,
    });
  }

  /**
   * Busca um usuário específico pelo ID.
   */
  async findOne(id: number): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelectSafeData,
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return user;
  }

  /**
   * Atualiza um usuário.
   * Este método AINDA faz hash, pois um usuário pode
   * atualizar sua própria senha.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<SafeUser> {
    const { password, ...restoDoDto } = updateUserDto;
    const data: Prisma.UserUpdateInput = { ...restoDoDto };

    if (password) {
      data.senha_hash = await bcrypt.hash(password, this.saltRounds);
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        select: userSelectSafeData,
      });
    } catch (error) {
      // ... (código de tratamento de erro P2025 e P2002)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Código P2025: O registro a ser atualizado não existe.
        if (error.code === 'P2025') {
          throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }
        // Código P2002: Conflito de campo 'unique'
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[];
          throw new ConflictException(
            `O campo ${target.join(', ')} já está em uso.`,
          );
        }
      }
      throw error;
    }
  }

  /**
   * Remove um usuário do banco de dados pelo ID.
   */
  async remove(id: number): Promise<SafeUser> {
    try {
      return await this.prisma.user.delete({
        where: { id },
        select: userSelectSafeData,
      });
    } catch (error) {
      // ... (código de tratamento de erro P2025)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Código P2025: O registro a ser deletado não existe.
        if (error.code === 'P2025') {
          throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }
      }
      throw error;
    }
  }

  //
  // O MÉTODO validateCredentials FOI REMOVIDO DAQUI
  // A lógica agora está em AuthService.validateUser
  //
}

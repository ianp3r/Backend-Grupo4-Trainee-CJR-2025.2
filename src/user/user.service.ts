import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Nosso serviço de BD
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Tipo 'SafeUser' omite a senha, usaremos como retorno padrão
// por segurança.
export type SafeUser = Omit<User, 'senha_hash'>;

// Para não repetir o 'select' em todas as queries, o definimos como uma constante.
const userSelectSafeData: Prisma.UserSelect = {
  id: true,
  username: true,
  nome: true,
  email: true,
  foto_perfil_url: true,
  created_at: true,
  updated_at: true,
};

@Injectable()
export class UserService {
  // Custo do processamento do hash
  private readonly saltRounds = 10;

  constructor(private prisma: PrismaService) { }


  /**
   * Cria um novo usuário no banco de dados.
   * Faz o hash da senha antes de salvar.
   */
  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const { password } = createUserDto;

    const senha_hash = await bcrypt.hash(password, this.saltRounds);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          ...createUserDto,
          senha_hash, // Substitui a senha pura pelo hash
        },
        select: userSelectSafeData, // Usa nosso 'select' padrão
      });

      return newUser;
    } catch (error) {
      // Trata erros conhecidos do Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Código P2002: Violação de constraint 'unique' (email ou username já existe)
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[];
          throw new ConflictException(`O campo ${target.join(', ')} já está em uso.`);
        }
      }
      throw error;
    }
  }

  /**
   * Retorna uma lista de todos os usuários.
   * A senha é omitida usando o 'select'.
   */
  async findAll(): Promise<SafeUser[]> {
    return this.prisma.user.findMany({
      select: userSelectSafeData,
    });
  }

  /**
   * Busca um usuário específico pelo ID.
   * Retorna 404 se não for encontrado.
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


  async update(id: number, updateUserDto: UpdateUserDto): Promise<SafeUser> {

    // Desestrutura o DTO para a senha em plaintext fique separada
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Código P2025: O registro a ser atualizado não existe.
        if (error.code === 'P2025') {
          throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }
        // Código P2002: Conflito de campo 'unique'
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[];
          throw new ConflictException(`O campo ${target.join(', ')} já está em uso.`);
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
      // retorna o usuário deletado
      return await this.prisma.user.delete({
        where: { id },
        select: userSelectSafeData,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Código P2025: O registro a ser deletado não existe.
        if (error.code === 'P2025') {
          throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }
      }
      throw error;
    }
  }
}

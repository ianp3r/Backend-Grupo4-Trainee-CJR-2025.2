import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService, SafeUser } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private prisma: PrismaService,
    private usersService: UserService,
    private jwtService: JwtService,
  ) { }

  /**
   * Valida o usuário contra o banco de dados.
   * Usado pelo LocalStrategy.
   */
  async validateUser(email: string, pass: string): Promise<SafeUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(pass, user.senha_hash))) {
      const { senha_hash, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Gera um JWT para um usuário válido.
   * Usado pelo AuthController.
   */
  async login(user: SafeUser) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  /**
   * Registra um novo usuário.
   */
  async register(registerUserDto: RegisterUserDto) {
    const { password, ...restoDoDto } = registerUserDto;

    const senha_hash = await bcrypt.hash(password, this.saltRounds);

    try {
      // Chama o UserService "burro" com os dados já tratados
      const newUser = await this.usersService.create({
        ...restoDoDto,
        senha_hash, // Passa o hash em vez da senha
      });

      // Loga o usuário recém-criado
      return this.login(newUser);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email ou username já está em uso.');
      }
      throw error;
    }
  }
}

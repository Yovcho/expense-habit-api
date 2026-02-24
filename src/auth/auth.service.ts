import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepo } from '../users/users.repo';

@Injectable()
export class AuthService {
  constructor(
    private usersRepo: UsersRepo,
    private jwtService: JwtService,
  ) {}

  private issueToken(userId: string, userEmail: string): Promise<string> {
    const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';
    return this.jwtService.signAsync({ sub: userId, email: userEmail }, {
      expiresIn,
    } as any);
  }

  async register(email: string, password: string) {
    const existing = await this.usersRepo.findByEmail(email);
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.usersRepo.create({
      email,
      passwordHash,
    });

    return {
      accessToken: await this.issueToken(user.id, user.email),
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: await this.issueToken(user.id, user.email),
    };
  }
}

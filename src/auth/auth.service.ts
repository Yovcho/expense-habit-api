import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepo } from '../modules/users/users.repo';

@Injectable()
export class AuthService {
  constructor(private usersRepo: UsersRepo) {}

  async register(email: string, password: string) {
    const existing = await this.usersRepo.findByEmail(email);
    if (existing) throw new ConflictException('Email already in use');

    // TEMP: we will hash later; for now store password directly as passwordHash
    const user = await this.usersRepo.create({
      email,
      passwordHash: password,
    });

    // never return passwordHash
    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }
}

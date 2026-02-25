import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RegisterSchema, LoginSchema } from './auth.schemas';
import type { RegisterRequest, LoginRequest } from './auth.schemas';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  register(@Body() body: RegisterRequest) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  login(@Body() body: LoginRequest) {
    return this.authService.login(body.email, body.password);
  }
}

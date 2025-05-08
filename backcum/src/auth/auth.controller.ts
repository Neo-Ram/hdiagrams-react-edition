import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string },
  ): Promise<string> {
    return this.authService.register(body.name, body.email, body.password);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ message: string; token?: string }> {
    return this.authService.login(body.email, body.password);
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint para registrar un usuario
  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string },
  ) {
    try {
      const result = await this.authService.register(
        body.name,
        body.email,
        body.password,
      );
      return result;
    } catch (error) {
      return {
        message: 'Error al registrar usuario',
        error: error.message,
      };
    }
  }

  // Endpoint para iniciar sesión
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const result = await this.authService.login(body.email, body.password);
      return result;
    } catch (error) {
      return {
        message: 'Error al iniciar sesión',
        error: error.message,
      };
    }
  }
}
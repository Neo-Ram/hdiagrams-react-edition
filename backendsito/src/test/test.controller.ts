import { Controller, Post, Body } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  // Endpoint para insertar un mensaje en la tabla
  @Post('insert-message')
  async insertMessage(@Body() body: { message: string }) {
    try {
      const result = await this.testService.insertTestMessage(body.message);
      return result;
    } catch (error) {
      return {
        message: 'Error al insertar el mensaje',
        error: error.message,
      };
    }
  }
}
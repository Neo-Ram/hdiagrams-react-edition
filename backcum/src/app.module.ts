import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TestModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

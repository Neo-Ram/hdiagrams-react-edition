import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { DiagramsModule } from './diagrams/diagrams.module';
import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [TestModule, AuthModule, ProjectsModule, DiagramsModule, GeminiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { DiagramsModule } from './diagrams/diagrams.module';

@Module({
  imports: [TestModule, AuthModule, ProjectsModule, DiagramsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

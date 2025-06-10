import {
  Param,
  Delete,
  Controller,
  Post,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project, DiagramsByType } from './types';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async createProject(
    @Body() body: { name: string; description: string; user_id: string },
  ): Promise<Project> {
    const { name, description, user_id } = body;
    return this.projectsService.createProject(name, description, user_id);
  }

  @Get()
  async getProjects(@Query('user_id') user_id: string): Promise<Project[]> {
    return this.projectsService.getProjectsByUser(user_id);
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string): Promise<{ message: string }> {
    return this.projectsService.deleteProject(id);
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<Project> {
    return this.projectsService.getProjectById(id);
  }

  @Get(':id/diagrams')
  async getProjectDiagrams(@Param('id') id: string): Promise<DiagramsByType> {
    return this.projectsService.getProjectDiagrams(id);
  }
}

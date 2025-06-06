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

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async createProject(
    @Body() body: { name: string; description: string; user_id: string },
  ) {
    const { name, description, user_id } = body;
    const project = await this.projectsService.createProject(
      name,
      description,
      user_id,
    );
    return project;
  }

  @Get()
  async getProjects(@Query('user_id') user_id: string) {
    return this.projectsService.getProjectsByUser(user_id);
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string) {
    return this.projectsService.deleteProject(id);
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string) {
    return this.projectsService.getProjectById(id);
  }
}

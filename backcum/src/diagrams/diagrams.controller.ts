import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { DiagramsService } from './diagrams.service';

@Controller('diagrams')
export class DiagramsController {
  constructor(private readonly diagramsService: DiagramsService) {}

  @Post('save')
  async saveDiagram(
    @Body() body: { project_id: number; json: string; type: string },
  ) {
    return this.diagramsService.saveDiagram(
      body.project_id,
      body.json,
      body.type,
    );
  }

  @Get('get')
  async getDiagram(
    @Query('project_id') projectId: number,
    @Query('type') type: string,
  ) {
    return this.diagramsService.getDiagramByProjectAndType(projectId, type);
  }
}

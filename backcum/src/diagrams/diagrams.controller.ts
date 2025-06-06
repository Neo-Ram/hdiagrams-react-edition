import { Controller, Post, Body } from '@nestjs/common';
import { DiagramsService } from './diagrams.service';

@Controller('diagrams')
export class DiagramsController {
  constructor(private readonly diagramsService: DiagramsService) {}

  @Post('save')
  async saveDiagram(
    @Body() body: { project_id: number; json: string }
  ) {
    return this.diagramsService.saveDiagram(body.project_id, body.json);
  }
}
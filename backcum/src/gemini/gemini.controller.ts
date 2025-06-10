import { Controller, Post, Body, Res, HttpException, HttpStatus } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { Response } from 'express';

interface FileData {
  path: string;
  content: string;
}

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('analyze')
  async analyzeDiagram(
    @Body() body: { diagramData: any; diagramType: string },
  ) {
    return this.geminiService.analyzeDiagram(
      body.diagramData,
      body.diagramType,
    );
  }

  @Post('generate-project')
  async generateProject(@Body() projectData: any) {
    try {
      console.log('Recibiendo solicitud de generación de proyecto:', JSON.stringify(projectData, null, 2));
      
      if (!projectData.diagrams) {
        console.error('No se recibieron diagramas en la solicitud');
        throw new Error('No se recibieron diagramas en la solicitud');
      }

      const result = await this.geminiService.generateProject(projectData);
      console.log('Proyecto generado exitosamente');
      return result;
    } catch (error) {
      console.error('Error en el controlador al generar proyecto:', error);
      throw new HttpException(
        error.message || 'Error al generar el proyecto',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('generate')
  async generateCode(@Body() body: { prompt: string }) {
    return this.geminiService.generateCode(body.prompt);
  }

  @Post('generate-zip')
  async generateZip(
    @Body() body: { files: FileData[] },
    @Res() res: Response,
  ) {
    try {
      const zipBuffer = await this.geminiService.generateProjectZip(body.files);
      
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=project.zip',
        'Content-Length': zipBuffer.length,
      });
      
      res.send(zipBuffer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate ZIP file' });
    }
  }
} 
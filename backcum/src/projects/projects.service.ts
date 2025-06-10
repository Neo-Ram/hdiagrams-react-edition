import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { Project, Diagram, DiagramsByType, DiagramType } from './types';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_KEY || '',
  );

  async createProject(name: string, description: string, user_id: string): Promise<Project> {
    const { data, error } = await this.supabase
      .from('projects')
      .insert([{ name, description, user_id }])
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data as Project;
  }

  async getProjectsByUser(user_id: string): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('user_id', user_id);

    if (error) throw new BadRequestException(error.message);
    return data as Project[];
  }

  async deleteProject(id: string): Promise<{ message: string }> {
    const { error } = await this.supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw new BadRequestException(error.message);
    return { message: 'Proyecto eliminado correctamente' };
  }

  async getProjectById(projectId: string): Promise<Project> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw new BadRequestException(error.message);
    return data as Project;
  }

  async getProjectDiagrams(projectId: string): Promise<DiagramsByType> {
    try {
      this.logger.debug(`Obteniendo diagramas para el proyecto ${projectId}`);
      
      const { data: diagrams, error } = await this.supabase
        .from('diagrams')
        .select('type, json')
        .eq('project_id', projectId);

      if (error) {
        this.logger.error(`Error al obtener diagramas: ${error.message}`);
        throw new BadRequestException(error.message);
      }

      if (!diagrams || diagrams.length === 0) {
        this.logger.warn(`No se encontraron diagramas para el proyecto ${projectId}`);
        return {};
      }

      this.logger.debug(`Diagramas encontrados: ${JSON.stringify(diagrams)}`);

      // Convertir el array de diagramas a un objeto con el tipo como clave
      const diagramsByType = (diagrams as Diagram[]).reduce((acc, diagram) => {
        if (this.isValidDiagramType(diagram.type)) {
          acc[diagram.type] = diagram.json;
        } else {
          this.logger.warn(`Tipo de diagrama inválido encontrado: ${diagram.type}`);
        }
        return acc;
      }, {} as DiagramsByType);

      return diagramsByType;
    } catch (error) {
      this.logger.error(`Error en getProjectDiagrams: ${error.message}`);
      throw new BadRequestException(`Error al obtener los diagramas: ${error.message}`);
    }
  }

  private isValidDiagramType(type: string): type is DiagramType {
    return ['class', 'sequence', 'usecase', 'component', 'package'].includes(type);
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class DiagramsService {
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_KEY || '',
  );

  async saveDiagram(project_id: number, json: string, type: string) {
    const { error, data } = await this.supabase
      .from('diagrams')
      .insert([{ project_id, json, type }]);

    if (error) {
      throw new BadRequestException(
        `Error al guardar diagrama: ${error.message}`,
      );
    }

    return { message: 'Diagrama guardado exitosamente', data };
  }

  async getDiagramByProjectAndType(project_id: number, type: string) {
    const { data, error } = await this.supabase
      .from('diagrams')
      .select('*')
      .eq('project_id', project_id)
      .eq('type', type)
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class DiagramsService {
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_KEY || '',
  );

  async saveDiagram(project_id: number, json: string) {
    const { error, data } = await this.supabase
      .from('diagrams')
      .insert([{ project_id, json }]);

    if (error) {
      throw new BadRequestException(
        `Error al guardar diagrama: ${error.message}`,
      );
    }

    return { message: 'Diagrama guardado exitosamente', data };
  }
}
import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class ProjectsService {
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_KEY || '',
  );

  async createProject(name: string, description: string, user_id: string) {
    const { data, error } = await this.supabase
      .from('projects')
      .insert([{ name, description, user_id }])
      .select('id')
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async getProjectsByUser(user_id: string) {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async deleteProject(projectId: string) {
    const { error } = await this.supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      throw new BadRequestException(error.message);
    }
    return { message: 'Proyecto eliminado correctamente' };
  }
  async getProjectById(projectId: string) {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error || !data) {
      throw new BadRequestException(error?.message || 'Proyecto no encontrado');
    }
    return data;
  }
}

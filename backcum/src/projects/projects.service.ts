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
}

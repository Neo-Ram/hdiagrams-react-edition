// src/test/test.service.ts
import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class TestService {
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_KEY || '',
  );

  async getMessage(): Promise<string> {
    const { data, error } = await this.supabase
      .from('test_table')
      .select('message')
      .limit(1)
      .single();

    if (error) throw new Error(`Error Supabase: ${error.message}`);

    return data.message;
  }
}
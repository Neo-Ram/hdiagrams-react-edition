import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class TestService {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        'SUPABASE_URL o SUPABASE_SERVICE_KEY no están configurados',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  // Método para insertar un mensaje en la tabla
  async insertTestMessage(message: string) {
    const { data, error } = await this.supabase
      .from('test_table')
      .insert([{ message }]);

    if (error) {
      throw new Error(`Error al insertar mensaje: ${error.message}`);
    }

    return { message: 'Mensaje insertado con éxito', data };
  }
}

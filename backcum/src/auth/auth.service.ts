import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_KEY || '',
  );

  async register(name: string, email: string, password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await this.supabase.from('users').insert([
      { name, email, password: hashedPassword },
    ]);

    if (error) {
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }

    return 'Usuario registrado exitosamente';
  }
}
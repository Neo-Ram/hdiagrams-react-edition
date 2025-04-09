import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private supabase;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('SUPABASE_URL o SUPABASE_SERVICE_KEY no están configurados');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  // Método para registrar un usuario
  async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await this.supabase.from('users').insert([
      { name, email, password: hashedPassword },
    ]);

    if (error) {
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }

    return { message: 'Usuario registrado con éxito', data };
  }

  // Método para iniciar sesión
  async login(email: string, password: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, name, email, password')
      .eq('email', email)
      .single();

    if (error) {
      throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, data.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    return {
      message: 'Inicio de sesión exitoso',
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
      },
    };
  }
}
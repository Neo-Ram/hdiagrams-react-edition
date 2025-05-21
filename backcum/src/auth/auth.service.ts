import { BadRequestException, Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_KEY || '',
  );

  async register(name: string, email: string, password: string): Promise<string> {
    //Verifica si el usuario ya existe tilin
    const { data: existingUser } = await this.supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new BadRequestException('El correo ya está registrado');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await this.supabase.from('users').insert([
      { name, email, password: hashedPassword },
    ]);

    if (error) {
      throw new BadRequestException(`Error al registrar usuario: ${error.message}`);
    }

    return 'Usuario registrado exitosamente';
  }

  async login(email: string, password: string): Promise<{ message: string }> {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, password')
      .eq('email', email)
      .single();

    if (error || !data) {
      return { message: 'Usuario o contraseña incorrectos' };
    }

    const isPasswordValid = await bcrypt.compare(password, data.password);
    if (!isPasswordValid) {
      return { message: 'Usuario o contraseña incorrectos' };
    }

    return { message: 'Inicio de sesión exitoso' };
  }

  
}
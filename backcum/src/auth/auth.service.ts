import { BadRequestException, Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import * as nodemailer from 'nodemailer';
import { Resend } from 'resend';

@Injectable()
export class AuthService {
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_KEY || '',
  );

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<string> {
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

    const { error } = await this.supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword }]);

    if (error) {
      throw new BadRequestException(
        `Error al registrar usuario: ${error.message}`,
      );
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
  private resend = new Resend(process.env.RESEND_API_KEY || '');

  async sendResetEmail(email: string, token: string) {
    const resetLink = `https://tusitio.com/reset-password/${token}`;
    await this.resend.emails.send({
      from: 'Soporte <noreply@hdiagrams.com>',
      to: email,
      subject: 'Recupera tu contraseña',
      html: `
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Si no solicitaste este cambio, ignora este correo.</p>
      `,
    });
    
  }
}

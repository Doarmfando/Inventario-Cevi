// src/features/admin/services/userService.ts
import { supabase } from '../../../lib/supabase';
import type { CreateUser, UpdateUser, UserWithRole } from '../types/user.types';

export class UserService {
  // Obtener todos los usuarios
  static async getUsers(): Promise<UserWithRole[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        id,
        nombre_usuario,
        nombre,
        email,
        visible,
        created_at,
        updated_at,
        roles!usuarios_rol_id_fkey(
          id,
          nombre,
          descripcion,
          visible
        )
      `)
      .eq('visible', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error en getUsers:', error);
      throw error;
    }
    
    // Formatear datos para el tipo correcto
    const formattedUsers: UserWithRole[] = (data || []).map(user => ({
      id: user.id,
      nombre_usuario: user.nombre_usuario,
      nombre: user.nombre,
      email: user.email,
      rol: Array.isArray(user.roles) ? user.roles[0] : user.roles,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));
    
    return formattedUsers;
  }

  // Crear usuario
  static async createUser(userData: CreateUser): Promise<UserWithRole> {
    // 1. Crear cuenta en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true
    });

    if (authError) throw authError;

    try {
      // 2. Crear registro en tabla usuarios
      const { data, error } = await supabase
        .from('usuarios')
        .insert({
          nombre_usuario: userData.nombre_usuario,
          nombre: userData.nombre,
          email: userData.email,
          rol_id: userData.rol_id,
          visible: true
        })
        .select(`
          id,
          nombre_usuario,
          nombre,
          email,
          visible,
          created_at,
          updated_at,
          roles!usuarios_rol_id_fkey(
            id,
            nombre,
            descripcion,
            visible
          )
        `)
        .single();
      
      if (error) throw error;
      
      // Formatear y retornar
      return {
        id: data.id,
        nombre_usuario: data.nombre_usuario,
        nombre: data.nombre,
        email: data.email,
        rol: Array.isArray(data.roles) ? data.roles[0] : data.roles,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      // Si falla la inserción en usuarios, limpiar la cuenta de auth
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw error;
    }
  }

  // Actualizar usuario
  static async updateUser(id: string, updates: UpdateUser): Promise<UserWithRole> {
    const { data, error } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('id', id)
      .select(`
        id,
        nombre_usuario,
        nombre,
        email,
        visible,
        created_at,
        updated_at,
        roles!usuarios_rol_id_fkey(
          id,
          nombre,
          descripcion,
          visible
        )
      `)
      .single();
    
    if (error) throw error;
    
    // Formatear y retornar
    return {
      id: data.id,
      nombre_usuario: data.nombre_usuario,
      nombre: data.nombre,
      email: data.email,
      rol: Array.isArray(data.roles) ? data.roles[0] : data.roles,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  // Eliminar usuario (soft delete)
  static async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .update({ visible: false })
      .eq('id', id);
    
    if (error) throw error;
  }
}
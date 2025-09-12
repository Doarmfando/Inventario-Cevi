// ==============================================
// ARCHIVO: src/features/admin/types/user.types.ts
// Tipos específicos para usuarios
// ==============================================

import type { Role } from '../hooks/useRoles';

export interface CreateUser {
  nombre_usuario: string;
  nombre: string;
  email: string;
  password: string;
  rol_id: string;
}

export interface UpdateUser {
  nombre_usuario?: string;
  nombre?: string;
  email?: string;
  rol_id?: string;
}

export interface UserWithRole {
  id: string;
  nombre_usuario: string;
  nombre: string;
  email: string;
  rol: Role;
  created_at: string;
  updated_at: string;
}

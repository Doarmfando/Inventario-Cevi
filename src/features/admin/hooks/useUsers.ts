// ==============================================
// ARCHIVO: src/features/admin/hooks/useUsers.ts
// Hook simplificado que usa el servicio
// ==============================================

import { useState, useEffect } from 'react';
import { UserService } from '../services/userService';
import type { CreateUser, UpdateUser, UserWithRole } from '../types/user.types';

export function useUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuarios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userData = await UserService.getUsers();
      setUsers(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Crear usuario
  const createUser = async (newUser: CreateUser): Promise<boolean> => {
    try {
      const createdUser = await UserService.createUser(newUser);
      setUsers(prev => [createdUser, ...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario');
      return false;
    }
  };

  // Actualizar usuario
  const updateUser = async (id: string, updates: UpdateUser): Promise<boolean> => {
    try {
      const updatedUser = await UserService.updateUser(id, updates);
      setUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar usuario');
      return false;
    }
  };

  // Eliminar usuario
  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      await UserService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario');
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers: fetchUsers,
    setError
  };
}

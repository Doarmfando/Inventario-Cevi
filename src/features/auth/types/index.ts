// src/features/auth/types/index.ts
export interface User {
  id: string;
  nombre_usuario: string;
  nombre: string;
  email: string;
  rol: {
    id: string;
    nombre: 'administrador' | 'usuario';
    descripcion: string;
  };
}

export interface Credentials {
  username: string;  // Esto puede ser username o email
  password: string;
}

// CORREGIDO: Cambiar primer parámetro de email a usernameOrEmail
export interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>; // Cambiado
  logout: () => Promise<void>;
  isAdmin: boolean;
}
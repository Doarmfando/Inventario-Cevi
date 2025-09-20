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

// Interfaz para el componente RememberMe
export interface RememberMeProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

// Interfaz para el componente PasswordInput
export interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

// AGREGAR ESTA INTERFAZ FALTANTE:
export interface InputWithIconProps {
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}
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
  username: string;
  password: string;
}

export interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

export interface RememberMeProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

// ← AGREGAR ESTA INTERFAZ QUE FALTA:
export interface InputWithIconProps {
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}
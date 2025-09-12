// src/features/auth/hooks/useAuth.ts
import { useAuthContext } from "../providers/useAuthContext";

export const useAuth = () => {
  const context = useAuthContext();
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  
  return context;
};
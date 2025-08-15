// src/features/auth/hooks/useAuth.ts
import { useAuthContext } from "../../../app/providers/AuthProvider";

export const useAuth = () => {
  const context = useAuthContext();
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  
  return context;
};
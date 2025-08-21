// src/features/movements/utils/formUtils.ts

export interface ExpiryStatus {
  message: string;
  color: string;
  icon: string;
}

// Función para calcular días hasta vencimiento
export const calculateDaysToExpiry = (expiryDate: string): number | null => {
  if (!expiryDate) return null;
  
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Función para obtener el mensaje de estado de vencimiento
export const getExpiryStatus = (days: number | null): ExpiryStatus | null => {
  if (days === null) return null;
  
  if (days < 0) {
    return { 
      message: `Vencido hace ${Math.abs(days)} día${Math.abs(days) !== 1 ? 's' : ''}`, 
      color: 'text-red-600',
      icon: '🚨' 
    };
  } else if (days === 0) {
    return { 
      message: 'Vence hoy', 
      color: 'text-red-600',
      icon: '⚠️' 
    };
  } else if (days <= 3) {
    return { 
      message: `Vence en ${days} día${days !== 1 ? 's' : ''}`, 
      color: 'text-orange-600',
      icon: '⚠️' 
    };
  } else if (days <= 7) {
    return { 
      message: `Vence en ${days} días`, 
      color: 'text-yellow-600',
      icon: '⏰' 
    };
  } else {
    return { 
      message: `Vence en ${days} días`, 
      color: 'text-green-600',
      icon: '✅' 
    };
  }
};

// Función para obtener la fecha de hoy en formato YYYY-MM-DD
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};
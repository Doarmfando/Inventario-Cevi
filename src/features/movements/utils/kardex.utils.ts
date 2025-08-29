// src/features/movements/utils/movement.utils.ts

// Función para obtener etiquetas de razones de movimiento
export const getReasonLabel = (reason: string): string => {
  const reasonLabels: Record<string, string> = {
    // Entradas
    compra: 'Compra',
    reposicion: 'Reposición',
    'ajuste-positivo': 'Ajuste Positivo',
    devolucion: 'Devolución',
    'transferencia-entrada': 'Transferencia Entrada',
    donacion: 'Donación',
    'produccion-interna': 'Producción Interna',
    
    // Salidas
    venta: 'Venta',
    perdida: 'Pérdida',
    roto: 'Roto',
    vencido: 'Vencido',
    'ajuste-negativo': 'Ajuste Negativo',
    'transferencia-salida': 'Transferencia Salida',
    'consumo-interno': 'Consumo Interno',
    merma: 'Merma',
    degustacion: 'Degustación',
  };
  
  return reasonLabels[reason] || reason;
};

// Función para validar tipos de movimiento
export const isValidMovementType = (type: string): boolean => {
  const validTypes = ['entrada', 'salida', 'ajuste'];
  return validTypes.includes(type);
};

// Función para obtener el color del tipo de movimiento
export const getMovementTypeColor = (type: string): string => {
  switch (type) {
    case 'entrada':
      return 'green';
    case 'salida':
      return 'red';
    case 'ajuste':
      return 'yellow';
    default:
      return 'gray';
  }
};
// Formatea una fecha en formato dd/mm/yyyy HH:mm
export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Formatea un número como moneda local (Soles, Dólares, etc.)
export const formatCurrency = (value: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
};
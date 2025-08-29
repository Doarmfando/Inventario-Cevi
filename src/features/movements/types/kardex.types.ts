// src/features/movements/types/kardex.types.ts

export interface Product {
  id: string;
  name: string;
  code: string;
  currentStock: number;
  unitPrice: number;
}

export interface KardexStats {
  totalEntradas: number;
  totalSalidas: number;
  totalAjustes: number;
}

export interface KardexModalProps {
  productId: string;
  onClose: () => void;
}
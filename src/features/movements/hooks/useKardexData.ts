// src/features/movements/hooks/useKardexData.ts

import { useMemo } from 'react';
import type { KardexEntry } from '../types/movement.types';
import type { Product, KardexStats } from '../types/kardex.types';

export const useKardexData = (productId: string) => {
  // Mock data - En tu app real, esto vendría de tu API basado en productId
  const product: Product = {
    id: productId,
    name: 'Lenguado Filetes',
    code: 'LF001',
    currentStock: 15,
    unitPrice: 28.50,
  };

  const kardexEntries: KardexEntry[] = [
    {
      id: '1',
      productId: productId,
      productName: product.name,
      container: 'Congelador-001',
      type: 'entrada',
      quantity: 20,
      packagedUnits: 4,
      previousStock: 0,
      newStock: 20,
      runningBalance: 20,
      runningPackagedBalance: 4,
      unitPrice: 28.50,
      totalValue: 570.00,
      reason: 'compra',
      observations: 'Compra inicial de inventario',
      documentNumber: 'FAC-001-001',
      createdBy: 'admin',
      createdAt: new Date('2024-08-01T10:00:00'),
    },
    {
      id: '2',
      productId: productId,
      productName: product.name,
      container: 'Congelador-001',
      type: 'salida',
      quantity: 5,
      packagedUnits: 1,
      previousStock: 20,
      newStock: 15,
      runningBalance: 15,
      runningPackagedBalance: 3,
      unitPrice: 28.50,
      totalValue: 142.50,
      reason: 'venta',
      observations: 'Venta a cliente',
      documentNumber: 'BOL-001-001',
      createdBy: 'admin',
      createdAt: new Date('2024-08-02T14:30:00'),
    },
    {
      id: '3',
      productId: productId,
      productName: product.name,
      container: 'Congelador-001',
      type: 'ajuste',
      quantity: 2,
      packagedUnits: 0,
      previousStock: 15,
      newStock: 17,
      runningBalance: 17,
      runningPackagedBalance: 3,
      reason: 'ajuste-positivo',
      observations: 'Ajuste por inventario físico',
      createdBy: 'admin',
      createdAt: new Date('2024-08-03T09:15:00'),
    },
    {
      id: '4',
      productId: productId,
      productName: product.name,
      container: 'Congelador-001',
      type: 'salida',
      quantity: 2,
      packagedUnits: 0,
      previousStock: 17,
      newStock: 15,
      runningBalance: 15,
      runningPackagedBalance: 3,
      unitPrice: 28.50,
      totalValue: 57.00,
      reason: 'venta',
      observations: 'Venta mostrador',
      createdBy: 'admin',
      createdAt: new Date('2024-08-04T16:45:00'),
    },
  ];

  const stats: KardexStats = useMemo(() => {
    const totalEntradas = kardexEntries
      .filter(entry => entry.type === 'entrada')
      .reduce((sum, entry) => sum + entry.quantity, 0);

    const totalSalidas = kardexEntries
      .filter(entry => entry.type === 'salida')
      .reduce((sum, entry) => sum + entry.quantity, 0);

    const totalAjustes = kardexEntries
      .filter(entry => entry.type === 'ajuste')
      .reduce((sum, entry) => sum + entry.quantity, 0);

    return {
      totalEntradas,
      totalSalidas,
      totalAjustes,
    };
  }, [kardexEntries]);

  return {
    product,
    kardexEntries,
    stats,
  };
};
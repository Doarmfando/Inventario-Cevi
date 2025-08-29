// src/features/movements/components/modals/KardexModal.tsx

import React from 'react';
import { KardexHeader } from './KardexHeader';
import { KardexStats } from './KardexStats';
import { KardexTable } from './KardexTable';
import { KardexFooter } from './KardexFooter';
import { useKardexData } from '../../hooks/useKardexData';
import type { KardexModalProps } from '../../types/kardex.types';

const KardexModal: React.FC<KardexModalProps> = ({ productId, onClose }) => {
  const { product, kardexEntries, stats } = useKardexData(productId);

  const handleExportKardex = () => {
    // Aquí implementarías la exportación a Excel/PDF
    console.log('Exportando kardex del producto:', product.name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <KardexHeader 
          product={product}
          onClose={onClose}
          onExport={handleExportKardex}
        />

        {/* Stats Summary */}
        <KardexStats stats={stats} currentStock={product.currentStock} />

        {/* Kardex Table */}
        <KardexTable entries={kardexEntries} />

        {/* Footer */}
        <KardexFooter 
          entriesCount={kardexEntries.length}
          productName={product.name}
        />
      </div>
    </div>
  );
};

export default KardexModal;
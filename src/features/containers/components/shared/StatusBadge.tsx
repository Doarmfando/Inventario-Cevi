// src/features/containers/components/shared/StatusBadge.tsx

import React from 'react';

interface StatusBadgeProps {
  status: 'activo' | 'mantenimiento' | 'inactivo';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'activo':
        return 'Activo';
      case 'mantenimiento':
        return 'Mantenimiento';
      case 'inactivo':
        return 'Inactivo';
      default:
        return status;
    }
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(status)} ${className}`}
    >
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;
// src/features/containers/components/shared/TypeIcon.tsx

import React from 'react';
import { 
  Container, 
  Thermometer,
  Warehouse,
  Snowflake,
  Droplets
} from 'lucide-react';

interface TypeIconProps {
  type: string;
  className?: string;
}

const TypeIcon: React.FC<TypeIconProps> = ({ type, className = 'w-5 h-5' }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'frigider':
        return <Thermometer className={`${className} text-blue-600`} />;
      case 'congelador':
        return <Snowflake className={`${className} text-cyan-600`} />;
      case 'almacen-seco':
        return <Warehouse className={`${className} text-amber-600`} />;
      case 'almacen-humedo':
        return <Droplets className={`${className} text-blue-700`} />;
      default:
        return <Container className={`${className} text-gray-600`} />;
    }
  };

  return getIcon(type);
};

export const getTypeLabel = (type: string) => {
  switch (type) {
    case 'frigider':
      return 'Refrigerador';
    case 'congelador':
      return 'Congelador';
    case 'almacen-seco':
      return 'Almacén Seco';
    case 'almacen-humedo':
      return 'Almacén Húmedo';
    default:
      return type;
  }
};

export default TypeIcon;
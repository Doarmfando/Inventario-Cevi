import React from "react";
import { Calendar } from "lucide-react";
// import { Refrigerator } from "lucide-react"; // TEMPORALMENTE OCULTO
import FormField from "./FormField";
import type { NewProduct } from "../../types";
// import type { Container } from "../types"; // TEMPORALMENTE OCULTO

interface SupplierDateSectionProps {
  form: NewProduct;
  errors: Record<string, string>;
  onChange: (field: keyof NewProduct) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const SupplierDateSection: React.FC<SupplierDateSectionProps> = ({ 
  form, 
  errors, 
  onChange 
}) => {
  // const containers: Container[] = [
    // TEMPORALMENTE OCULTO - FUNCIONALIDAD DE CONTENEDORES
    /*
    'Frigider 1 - Causa',
    'Frigider 2 - Pescado', 
    'Frigider 3 - Yuca',
    'Frigider 4 - Mariscos',
    'Congelador 1',
    'Congelador 2', 
    'Congelador 3',
    'Congelador 4',
    'Almacén Seco'
    */
  // ];

  // Obtener fecha mínima (mañana)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <>
      {/* Proveedor */}
      <FormField
        label="Proveedor"
        error={errors.supplier}
        required
      >
        <input
          type="text"
          value={form.supplier}
          onChange={onChange("supplier")}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.supplier ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Ej: Mercado Pesquero Central"
        />
      </FormField>

      {/* Fecha de vencimiento */}
      <div className="grid grid-cols-1 gap-4">
        <FormField
          label="Fecha de Vencimiento"
          error={errors.expiryDate}
          required
          icon={Calendar}
        >
          <input
            type="date"
            value={form.expiryDate}
            onChange={onChange("expiryDate")}
            min={getMinDate()}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.expiryDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </FormField>

        {/* TEMPORALMENTE OCULTO - FUNCIONALIDAD DE CONTENEDORES */}
        {/*
        <FormField
          label="Contenedor"
          required
          icon={Refrigerator}
        >
          <select
            value={form.container}
            onChange={onChange("container")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {containers.map(container => (
              <option key={container} value={container}>{container}</option>
            ))}
          </select>
        </FormField>
        */}
      </div>
    </>
  );
};

export default SupplierDateSection;
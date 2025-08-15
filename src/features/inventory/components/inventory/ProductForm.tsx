import React, { useState } from "react";
import type { NewProduct } from "../../types";
import FormHeader from "../form/FormHeader";
import BasicInfoSection from "../form/BasicInfoSection";
import QuantityPriceSection from "../form/QuantityPriceSection";
import SupplierDateSection from "../form/SupplierDateSection";
import StateSelector from "../form/StateSelector";
import FormActions from "../form/FormActions";

interface Props {
  onSubmit: (product: NewProduct) => void;
  onClose: () => void;
}

const ProductForm: React.FC<Props> = ({ onSubmit, onClose }) => {
  const [form, setForm] = useState<NewProduct>({
    name: "",
    category: "Pescados",
    quantity: 0,
    unit: "kg",
    price: 0,
    minStock: 0,
    supplier: "",
    expiryDate: "",
    // container: "Frigider 2 - Pescado", // TEMPORALMENTE OCULTO
    state: "fresco"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof NewProduct) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = field === "quantity" || field === "price" || field === "minStock" 
      ? Number(e.target.value) 
      : e.target.value;
    
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "El nombre es requerido";
    if (form.quantity <= 0) newErrors.quantity = "La cantidad debe ser mayor a 0";
    if (form.price <= 0) newErrors.price = "El precio debe ser mayor a 0";
    if (form.minStock < 0) newErrors.minStock = "El stock mínimo no puede ser negativo";
    if (!form.supplier.trim()) newErrors.supplier = "El proveedor es requerido";
    if (!form.expiryDate) newErrors.expiryDate = "La fecha de vencimiento es requerida";

    // Validar que la fecha de vencimiento sea futura
    const today = new Date().toISOString().split('T')[0];
    if (form.expiryDate && form.expiryDate <= today) {
      newErrors.expiryDate = "La fecha de vencimiento debe ser futura";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(form);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <FormHeader onClose={onClose} />

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <BasicInfoSection 
            form={form} 
            errors={errors} 
            onChange={handleChange} 
          />

          {/* Cantidad y precios */}
          <QuantityPriceSection 
            form={form} 
            errors={errors} 
            onChange={handleChange} 
          />

          {/* Proveedor y fecha */}
          <SupplierDateSection 
            form={form} 
            errors={errors} 
            onChange={handleChange} 
          />

          {/* Estado */}
          <StateSelector 
            form={form} 
            onChange={handleChange} 
          />

          {/* Botones */}
          <FormActions onCancel={onClose} />
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
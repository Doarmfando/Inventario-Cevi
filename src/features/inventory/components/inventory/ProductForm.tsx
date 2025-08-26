import React, { useState } from "react";
import type { NewProduct, Container, ProductCategory } from "../../types";
import FormHeader from "../form/FormHeader";
import SimplifiedBasicInfoSection from "../form/SimplifiedBasicInfoSection";
import FormActions from "../form/FormActions";

interface Props {
  onSubmit: (product: NewProduct) => void;
  onClose: () => void;
}

const ProductForm: React.FC<Props> = ({ onSubmit, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    category: "Pescados" as ProductCategory,
    container: "",
    recommendedContainers: [] as Container[], // NUEVO: Contenedores recomendados
    unit: "kg" as const, // Unidad de medida
    minStock: 0, // Stock mínimo requerido
    price: 0, // Precio Unitario Estimado
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = ["price", "minStock"].includes(field) ? Number(e.target.value) : e.target.value;
    
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // NUEVO: Función para manejar cambios en contenedores recomendados
  const handleRecommendedContainersChange = (containers: Container[]) => {
    setForm(prev => ({ ...prev, recommendedContainers: containers }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "El nombre es requerido";
    if (!form.container.trim()) newErrors.container = "El contenedor es requerido";
    if (form.price <= 0) newErrors.price = "El precio debe ser mayor a 0";
    if (form.minStock < 0) newErrors.minStock = "El stock mínimo no puede ser negativo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Crear el producto con valores por defecto para campos no incluidos
      const productData: NewProduct = {
        ...form,
        // NUEVO: Incluir contenedores recomendados
        recommendedContainers: form.recommendedContainers,
        // Valores por defecto que se llenarán desde movimientos/entradas
        quantity: 0, // Stock inicia en 0
        supplier: "", // Se llena en movimientos
        expiryDate: "", // Se calcula en movimientos
        estimatedDaysToExpiry: 0, // Se llena en movimientos
        packagedUnits: 0, // Inicia sin empaquetados
        weightPerPackage: 1, // Valor por defecto
        packagedExpiryDays: 0, // Se calcula después
        state: "fresco" as const // Estado por defecto
      };

      onSubmit(productData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <FormHeader 
          onClose={onClose} 
          title="Registrar Producto"
          subtitle="Información básica del producto - Stock se llenará con movimientos"
        />

        {/* Formulario Simplificado */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Solo información básica CON contenedores recomendados */}
          <SimplifiedBasicInfoSection 
            form={form} 
            errors={errors} 
            onChange={handleChange}
            onRecommendedContainersChange={handleRecommendedContainersChange} 
          />

          {/* Información sobre contenedores seleccionados */}
          {form.recommendedContainers.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <div className="bg-purple-100 p-1 rounded-full mt-0.5">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-purple-800">
                  <p className="font-medium">📦 Distribución configurada:</p>
                  <p>• <strong>Ubicación principal:</strong> {form.container || "Sin definir"}</p>
                  <p>• <strong>Contenedores para distribución ({form.recommendedContainers.length}):</strong></p>
                  <div className="ml-4 mt-1">
                    {form.recommendedContainers.map((container, _index) => (
                      <span key={container} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded mr-1 mb-1 inline-block">
                        {container}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Información sobre el proceso */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium">📝 Proceso simplificado:</p>
                <p>• El <strong>stock</strong> iniciará en 0 y se llenará con movimientos/entradas</p>
                <p>• Los <strong>empaquetados</strong> se agregarán desde otras vistas</p>
                <p>• El <strong>precio real</strong> se actualizará con las compras</p>
                <p>• Los datos de <strong>vencimiento</strong> se calcularán automáticamente</p>
                <p>• Los <strong>contenedores recomendados</strong> facilitarán la distribución en movimientos</p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <FormActions onCancel={onClose} />
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
// src/features/inventory/components/inventory/ProductForm.tsx
import React, { useState } from "react";
import type { FormularioProducto, DBCategoria, DBUnidadMedida, DBContenedor } from "../../types";
import FormHeader from "../form/FormHeader";
import SimplifiedBasicInfoSection from "../form/SimplifiedBasicInfoSection";
import FormActions from "../form/FormActions";

interface Props {
  onSubmit: (product: FormularioProducto) => void;
  onClose: () => void;
  // Datos de la BD que se pasan como props
  categories: DBCategoria[];
  units: DBUnidadMedida[];
  containers: DBContenedor[];
}

const ProductForm: React.FC<Props> = ({ onSubmit, onClose, categories, units, containers }) => {
  // Estado del formulario basado en FormularioProducto
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    categoria_id: "", // UUID de la categoría
    unidad_medida_id: "", // UUID de la unidad de medida
    contenedor_fijo_id: "", // UUID del contenedor principal
    contenedores_recomendados_ids: [] as string[], // Array de UUIDs
    precio_estimado: 0,
    stock_min: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = ["precio_estimado", "stock_min"].includes(field) 
      ? Number(e.target.value) 
      : e.target.value;
    
    setForm(prev => ({ ...prev, [field]: value as any }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleRecommendedContainersChange = (containerIds: string[]) => {
    setForm(prev => ({ ...prev, contenedores_recomendados_ids: containerIds }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!form.categoria_id) newErrors.categoria_id = "Debes seleccionar una categoría";
    if (!form.unidad_medida_id) newErrors.unidad_medida_id = "Debes seleccionar una unidad de medida";
    if (!form.contenedor_fijo_id) newErrors.contenedor_fijo_id = "El contenedor principal es requerido";
    if (form.precio_estimado <= 0) newErrors.precio_estimado = "El precio debe ser mayor a 0";
    if (form.stock_min < 0) newErrors.stock_min = "El stock mínimo no puede ser negativo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const productData: FormularioProducto = {
        nombre: form.nombre,
        descripcion: form.descripcion || undefined,
        categoria_id: form.categoria_id,
        unidad_medida_id: form.unidad_medida_id,
        contenedor_fijo_id: form.contenedor_fijo_id,
        contenedores_recomendados_ids: form.contenedores_recomendados_ids,
        precio_estimado: form.precio_estimado,
        stock_min: form.stock_min,
      };

      onSubmit(productData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <FormHeader 
          onClose={onClose} 
          title="Registrar Producto"
          subtitle="Información básica del producto - Stock se llenará con movimientos"
        />

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <SimplifiedBasicInfoSection 
            form={form} 
            errors={errors} 
            onChange={handleChange}
            onRecommendedContainersChange={handleRecommendedContainersChange}
            categories={categories}
            units={units}
            containers={containers}
          />

          {form.contenedores_recomendados_ids.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <div className="bg-purple-100 p-1 rounded-full mt-0.5">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-purple-800">
                  <p className="font-medium">📦 Distribución configurada:</p>
                  <p>• <strong>Contenedor principal:</strong> {containers.find(c => c.id === form.contenedor_fijo_id)?.nombre}</p>
                  <p>• <strong>Contenedores para distribución ({form.contenedores_recomendados_ids.length}):</strong></p>
                  <div className="ml-4 mt-1">
                    {form.contenedores_recomendados_ids.map((containerId) => {
                      const container = containers.find(c => c.id === containerId);
                      return (
                        <span key={containerId} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded mr-1 mb-1 inline-block">
                          {container?.nombre}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

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
                <p>• Los <strong>empaquetados</strong> se agregarán desde detalle de contenedores</p>
                <p>• El <strong>precio real</strong> se actualizará con las compras en movimientos</p>
                <p>• Los datos de <strong>vencimiento</strong> se manejarán en detalle_contenedor</p>
                <p>• Los <strong>contenedores recomendados</strong> facilitarán la distribución en movimientos</p>
              </div>
            </div>
          </div>

          <FormActions onCancel={onClose} />
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
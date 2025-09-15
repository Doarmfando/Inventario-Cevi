// src/features/containers/components/ContainerForm.tsx

import React, { useState, useEffect } from 'react';
import { X, Container } from 'lucide-react';
import type { ContainerFormData, TipoContenedor } from '../../types/container.types';

interface ContainerFormProps {
  onSubmit: (data: ContainerFormData) => void;
  onClose: () => void;
  initialData?: Partial<ContainerFormData>;
  isEdit?: boolean;
  tiposContenedor?: TipoContenedor[];
}

const ContainerForm: React.FC<ContainerFormProps> = ({
  onSubmit,
  onClose,
  initialData = {},
  isEdit = false,
  tiposContenedor = []
}) => {
  const [formData, setFormData] = useState<ContainerFormData>({
    nombre: initialData.nombre || '',
    tipo_contenedor_id: initialData.tipo_contenedor_id || '',
    codigo: initialData.codigo || '',
    capacidad: initialData.capacidad || undefined,
    descripcion: initialData.descripcion || '',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    const numericFields = ['capacidad'];
    const processedValue = numericFields.includes(name) && value !== '' 
      ? parseFloat(value) 
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.tipo_contenedor_id) {
      newErrors.tipo_contenedor_id = 'El tipo es requerido';
    }

    // Validate capacity
    if (formData.capacidad !== undefined && formData.capacidad <= 0) {
      newErrors.capacidad = 'La capacidad debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Generar código automático si no existe
  useEffect(() => {
    if (!isEdit && !formData.codigo && formData.nombre) {
      const codigoGenerado = formData.nombre
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 10);
      
      setFormData(prev => ({
        ...prev,
        codigo: codigoGenerado
      }));
    }
  }, [formData.nombre, isEdit, formData.codigo]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Container className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isEdit ? 'Editar Contenedor' : 'Nuevo Contenedor'}
              </h3>
              <p className="text-sm text-gray-500">
                {isEdit ? 'Modifica los datos del contenedor' : 'Añade un nuevo espacio de almacenamiento'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Contenedor *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Refrigerador Principal A"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código
              </label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo || ''}
                onChange={handleInputChange}
                placeholder="Ej: REF-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Se genera automáticamente si se deja vacío
              </p>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Contenedor *
              </label>
              <select
                name="tipo_contenedor_id"
                value={formData.tipo_contenedor_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.tipo_contenedor_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar tipo...</option>
                {tiposContenedor.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
              {errors.tipo_contenedor_id && (
                <p className="mt-1 text-sm text-red-600">{errors.tipo_contenedor_id}</p>
              )}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidad (unidades)
              </label>
              <input
                type="number"
                name="capacidad"
                value={formData.capacidad || ''}
                onChange={handleInputChange}
                placeholder="Ej: 100"
                min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.capacidad ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.capacidad && (
                <p className="mt-1 text-sm text-red-600">{errors.capacidad}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="Descripción adicional del contenedor..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {isEdit ? 'Actualizar' : 'Crear'} Contenedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContainerForm;
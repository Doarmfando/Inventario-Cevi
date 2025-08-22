// src/features/containers/components/ContainerForm.tsx

import React, { useState } from 'react';
import { X, Container, MapPin, Thermometer, Package } from 'lucide-react';
import type { ContainerFormData } from '../types/container.types';

interface ContainerFormProps {
  onSubmit: (data: ContainerFormData) => void;
  onClose: () => void;
  initialData?: Partial<ContainerFormData>;
  isEdit?: boolean;
}

const ContainerForm: React.FC<ContainerFormProps> = ({
  onSubmit,
  onClose,
  initialData = {},
  isEdit = false
}) => {
  const [formData, setFormData] = useState<ContainerFormData>({
    name: initialData.name || '',
    type: initialData.type || 'almacen-seco',
    location: initialData.location || '',
    capacity: initialData.capacity || undefined,
    temperature: initialData.temperature || undefined,
    humidity: initialData.humidity || undefined,
    description: initialData.description || '',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    const numericFields = ['capacity', 'temperature', 'humidity'];
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
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.type) {
      newErrors.type = 'El tipo es requerido';
    }

    // Validate temperature ranges based on type
    if (formData.type === 'frigider' && formData.temperature !== undefined) {
      if (formData.temperature < 0 || formData.temperature > 8) {
        newErrors.temperature = 'La temperatura para refrigerador debe estar entre 0°C y 8°C';
      }
    }

    if (formData.type === 'congelador' && formData.temperature !== undefined) {
      if (formData.temperature < -25 || formData.temperature > -15) {
        newErrors.temperature = 'La temperatura para congelador debe estar entre -25°C y -15°C';
      }
    }

    // Validate capacity
    if (formData.capacity !== undefined && formData.capacity <= 0) {
      newErrors.capacity = 'La capacidad debe ser mayor a 0';
    }

    // Validate humidity
    if (formData.humidity !== undefined && (formData.humidity < 0 || formData.humidity > 100)) {
      newErrors.humidity = 'La humedad debe estar entre 0% y 100%';
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

  const containerTypes = [
    { value: 'almacen-seco', label: 'Almacén Seco', icon: Package },
    { value: 'almacen-humedo', label: 'Almacén Húmedo', icon: Package },
    { value: 'frigider', label: 'Refrigerador', icon: Thermometer },
    { value: 'congelador', label: 'Congelador', icon: Thermometer },
  ];

  const showTemperatureField = ['frigider', 'congelador'].includes(formData.type);
  const showHumidityField = ['almacen-humedo', 'frigider'].includes(formData.type);

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
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Refrigerador Principal A"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Contenedor *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {containerTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ej: Almacén Principal - Piso 1"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidad (unidades)
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity || ''}
                onChange={handleInputChange}
                placeholder="Ej: 100"
                min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.capacity ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
              )}
            </div>

            {/* Temperature */}
            {showTemperatureField && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperatura (°C)
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature || ''}
                  onChange={handleInputChange}
                  placeholder={formData.type === 'congelador' ? 'Ej: -20' : 'Ej: 4'}
                  step="0.1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.temperature ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.temperature && (
                  <p className="mt-1 text-sm text-red-600">{errors.temperature}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.type === 'frigider' && 'Rango recomendado: 0°C a 8°C'}
                  {formData.type === 'congelador' && 'Rango recomendado: -25°C a -15°C'}
                </p>
              </div>
            )}

            {/* Humidity */}
            {showHumidityField && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Humedad (%)
                </label>
                <input
                  type="number"
                  name="humidity"
                  value={formData.humidity || ''}
                  onChange={handleInputChange}
                  placeholder="Ej: 60"
                  min="0"
                  max="100"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.humidity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.humidity && (
                  <p className="mt-1 text-sm text-red-600">{errors.humidity}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Rango: 0% a 100%
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
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
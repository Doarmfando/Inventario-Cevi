// src/features/movements/hooks/useMovementForm.ts
// HOOK ACTUALIZADO SIN DUPLICACIÓN

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../../../lib/supabase';
import { MovementsService } from '../services/movementsService';
import type { 
  MovementFormData, 
  MovementWithDetails,
  AvailableProduct
} from '../types/movement.types';

interface UseMovementFormProps {
  onSuccess: () => void; // Solo para cerrar modal/limpiar UI
  onMovementCreated?: (movement: MovementWithDetails) => void; // Opcional para agregar a lista
}

export interface UseMovementFormReturn {
  formData: MovementFormData;
  loading: boolean;
  selectedProduct: AvailableProduct | undefined;
  availableProducts: AvailableProduct[];
  containers: Array<{id: string; nombre: string}>;
  errors: Record<string, string>;
  newStockInfo: { stock: number } | null;
  isValid: boolean;
  handleInputChange: (field: keyof MovementFormData, value: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  validateForm: () => boolean;
}

const useMovementForm = ({ onSuccess, onMovementCreated }: UseMovementFormProps): UseMovementFormReturn => {
  // Estado inicial del formulario CON EMPAQUETADO
  const [formData, setFormData] = useState<MovementFormData>({
    tipo_movimiento: 'entrada',
    motivo_movimiento_id: '',
    producto_id: '',
    contenedor_id: '',
    cantidad: 0,
    empaquetado: '', // AGREGADO: campo para empaquetado/raciones
    precio_real: undefined,
    numero_documento: '',
    observacion: ''
  });

  // Estados para datos de BD
  const [availableProducts, setAvailableProducts] = useState<AvailableProduct[]>([]);
  const [allContainers, setAllContainers] = useState<Array<{id: string; nombre: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar productos disponibles usando el servicio
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Cargar productos usando el servicio
        const productos = await MovementsService.getProductosDisponibles();
        setAvailableProducts(productos);

        // Cargar todos los contenedores disponibles
        const { data: contenedores, error } = await supabase
          .from('contenedores')
          .select('id, nombre, codigo')
          .eq('visible', true)
          .order('nombre');

        if (error) throw error;

        const formattedContainers = (contenedores || []).map(cont => ({
          id: cont.id,
          nombre: cont.nombre
        }));

        setAllContainers(formattedContainers);
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Producto seleccionado actual
  const selectedProduct = useMemo(() => {
    return availableProducts.find(p => p.id === formData.producto_id);
  }, [formData.producto_id, availableProducts]);

  // Contenedores disponibles
  const containers = useMemo(() => {
    if (!selectedProduct) {
      return allContainers;
    }

    const contenedorFijoIds = selectedProduct.contenedor_fijo ? [selectedProduct.contenedor_fijo.id] : [];
    const recomendadosIds = selectedProduct.contenedores_recomendados.map(c => c.id);
    const productoContainerIds = new Set([...contenedorFijoIds, ...recomendadosIds]);
    
    const otherContainers = allContainers.filter(c => !productoContainerIds.has(c.id));
    
    const result = [
      ...(selectedProduct.contenedor_fijo ? [selectedProduct.contenedor_fijo] : []),
      ...selectedProduct.contenedores_recomendados,
      ...otherContainers
    ];

    return result;
  }, [selectedProduct, allContainers]);

  // Calcular nuevo stock
  const newStockInfo = useMemo(() => {
    if (!selectedProduct || formData.cantidad === 0) return null;

    let newStock = selectedProduct.stock_actual;
    
    switch (formData.tipo_movimiento) {
      case 'entrada':
        newStock += formData.cantidad;
        break;
      case 'salida':
        newStock -= formData.cantidad;
        break;
      case 'ajuste':
        newStock = formData.cantidad;
        break;
    }

    return { stock: newStock };
  }, [selectedProduct, formData.cantidad, formData.tipo_movimiento]);

  // Manejar cambios en el formulario
  const handleInputChange = useCallback((field: keyof MovementFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando se modifica
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Resetear motivo cuando cambia el tipo
    if (field === 'tipo_movimiento') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        motivo_movimiento_id: ''
      }));
    }

    // Auto-seleccionar contenedor cuando cambia el producto
    if (field === 'producto_id' && value) {
      const product = availableProducts.find(p => p.id === value);
      if (product) {
        if (product.contenedor_fijo) {
          setFormData(prev => ({
            ...prev,
            producto_id: value,
            contenedor_id: product.contenedor_fijo!.id,
            precio_real: prev.precio_real === undefined ? product.precio_estimado : prev.precio_real
          }));
        } else if (product.contenedores_recomendados.length > 0) {
          setFormData(prev => ({
            ...prev,
            producto_id: value,
            contenedor_id: product.contenedores_recomendados[0].id,
            precio_real: prev.precio_real === undefined ? product.precio_estimado : prev.precio_real
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            producto_id: value,
            precio_real: prev.precio_real === undefined ? product.precio_estimado : prev.precio_real
          }));
        }
      }
    }
  }, [errors, availableProducts]);

  // Validar formulario
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.producto_id) {
      newErrors.producto_id = 'Selecciona un producto';
    }

    if (!formData.contenedor_id) {
      newErrors.contenedor_id = 'Selecciona un contenedor';
    }

    if (!formData.motivo_movimiento_id) {
      newErrors.motivo_movimiento_id = 'Selecciona un motivo';
    }

    if (formData.cantidad <= 0) {
      newErrors.cantidad = 'La cantidad debe ser mayor a 0';
    }

    if (formData.tipo_movimiento === 'salida' && selectedProduct) {
      if (formData.cantidad > selectedProduct.stock_actual) {
        newErrors.cantidad = `Stock insuficiente. Disponible: ${selectedProduct.stock_actual} ${selectedProduct.unidad_medida}`;
      }
    }

    if (formData.tipo_movimiento === 'entrada' && !formData.precio_real) {
      newErrors.precio_real = 'El precio es requerido para entradas';
    }

    // Validación opcional para empaquetado
    if (formData.empaquetado && formData.empaquetado.length > 100) {
      newErrors.empaquetado = 'El empaquetado no debe exceder 100 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedProduct]);

  // Determinar si el formulario es válido
  const isValid = useMemo(() => {
    return (
      formData.producto_id !== '' &&
      formData.contenedor_id !== '' &&
      formData.motivo_movimiento_id !== '' &&
      formData.cantidad > 0 &&
      (formData.tipo_movimiento !== 'entrada' || formData.precio_real !== undefined)
    );
  }, [formData]);

  // ✅ MANEJAR ENVÍO SIN DUPLICACIÓN
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // ✅ 1. Crear movimiento y obtener datos completos
      const movementCreated = await MovementsService.crearMovimientoCompleto(formData);
      
      // ✅ 2. Notificar que se creó el movimiento (para agregar a lista)
      onMovementCreated?.(movementCreated);
      
      // ✅ 3. Cerrar modal/limpiar UI
      onSuccess();
      
      // ✅ 4. Resetear formulario
      setFormData({
        tipo_movimiento: 'entrada',
        motivo_movimiento_id: '',
        producto_id: '',
        contenedor_id: '',
        cantidad: 0,
        empaquetado: '',
        precio_real: undefined,
        numero_documento: '',
        observacion: ''
      });
      
      // ✅ 5. Actualizar solo productos para stock (sin recargar lista completa)
      const productos = await MovementsService.getProductosDisponibles();
      setAvailableProducts(productos);
      
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
      setErrors({ general: 'Error al registrar el movimiento. Por favor intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, onSuccess, onMovementCreated]);

  return {
    formData,
    loading,
    selectedProduct,
    availableProducts,
    containers,
    errors,
    newStockInfo,
    isValid,
    handleInputChange,
    handleSubmit,
    validateForm
  };
};

export default useMovementForm;
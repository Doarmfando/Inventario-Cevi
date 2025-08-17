import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import MovementsList from './MovementsList';
import MovementForm from './MovementForm';
import MovementFilters from './MovementFilters';
import KardexModal from './KardexModal';
import type { Movement, MovementFilters as Filters, MovementFormData } from '../types/movement.types';

const MovementView: React.FC = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [filteredMovements, setFilteredMovements] = useState<Movement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showKardex, setShowKardex] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // Mock data - En tu app real, esto vendría de tu API
  const mockProducts = [
    { id: '1', name: 'Lenguado Filetes', code: 'LF001', currentStock: 15 },
    { id: '2', name: 'Pulpo', code: 'P001', currentStock: 8 },
    { id: '3', name: 'Yuca', code: 'Y001', currentStock: 25 },
    { id: '4', name: 'Rocoto', code: 'R001', currentStock: 5 },
  ];

  // Datos mock de movimientos iniciales
  useEffect(() => {
    const mockMovements: Movement[] = [
      {
        id: '1',
        productId: '1',
        productName: 'Lenguado Filetes',
        productCode: 'LF001',
        type: 'entrada',
        quantity: 20,
        previousStock: 0,
        newStock: 20,
        unitPrice: 28.50,
        totalValue: 570.00,
        reason: 'Compra inicial de inventario',
        documentNumber: 'FAC-001-001',
        createdBy: 'admin',
        createdAt: new Date('2024-08-01T10:00:00'),
      },
      {
        id: '2',
        productId: '1',
        productName: 'Lenguado Filetes',
        productCode: 'LF001',
        type: 'salida',
        quantity: 5,
        previousStock: 20,
        newStock: 15,
        unitPrice: 28.50,
        totalValue: 142.50,
        reason: 'Venta a cliente',
        documentNumber: 'BOL-001-001',
        createdBy: 'admin',
        createdAt: new Date('2024-08-02T14:30:00'),
      },
      {
        id: '3',
        productId: '2',
        productName: 'Pulpo',
        productCode: 'P001',
        type: 'entrada',
        quantity: 10,
        previousStock: 5,
        newStock: 15,
        unitPrice: 35.00,
        totalValue: 350.00,
        reason: 'Reposición de stock',
        documentNumber: 'FAC-001-002',
        createdBy: 'admin',
        createdAt: new Date('2024-08-03T09:15:00'),
      },
      {
        id: '4',
        productId: '2',
        productName: 'Pulpo',
        productCode: 'P001',
        type: 'salida',
        quantity: 7,
        previousStock: 15,
        newStock: 8,
        unitPrice: 35.00,
        totalValue: 245.00,
        reason: 'Venta mostrador',
        createdBy: 'admin',
        createdAt: new Date('2024-08-04T16:45:00'),
      },
    ];
    
    setMovements(mockMovements);
  }, []);

  // Efecto para filtrar movimientos cuando cambien los filtros o movimientos
  useEffect(() => {
    setFilteredMovements(movements);
  }, [movements]);

  // Función para agregar nuevo movimiento
  const handleAddMovement = (formData: MovementFormData) => {
    // Buscar el producto seleccionado
    const selectedProduct = mockProducts.find(p => p.id === formData.productId);
    
    if (!selectedProduct) {
      console.error('Producto no encontrado');
      return;
    }

    // Calcular stock anterior y nuevo
    const lastMovement = movements
      .filter(m => m.productId === formData.productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    
    const previousStock = lastMovement ? lastMovement.newStock : selectedProduct.currentStock;
    
    let newStock: number;
    switch (formData.type) {
      case 'entrada':
        newStock = previousStock + formData.quantity;
        break;
      case 'salida':
        newStock = previousStock - formData.quantity;
        break;
      case 'ajuste':
        // Para ajustes, la cantidad puede ser positiva o negativa
        newStock = previousStock + formData.quantity;
        break;
      default:
        newStock = previousStock;
    }

    const newMovement: Movement = {
      id: Date.now().toString(),
      productId: formData.productId,
      productName: selectedProduct.name,
      productCode: selectedProduct.code,
      type: formData.type,
      quantity: formData.quantity,
      previousStock,
      newStock,
      unitPrice: formData.unitPrice,
      totalValue: formData.unitPrice ? formData.quantity * formData.unitPrice : undefined,
      reason: formData.reason,
      documentNumber: formData.documentNumber,
      createdBy: 'admin', // En tu app real, obtener del contexto de usuario
      createdAt: new Date(),
    };

    setMovements(prev => [newMovement, ...prev]);
    setShowForm(false);

    // Mostrar mensaje de éxito (opcional)
    console.log('Movimiento registrado exitosamente:', newMovement);
  };

  // Función para manejar el cambio de filtros
  const handleFiltersChange = (newFilters: Filters) => {
    let filtered = [...movements];

    // Aplicar filtros
    if (newFilters.type && newFilters.type !== 'all') {
      filtered = filtered.filter(movement => movement.type === newFilters.type);
    }
    
    if (newFilters.productId) {
      filtered = filtered.filter(movement => movement.productId === newFilters.productId);
    }
    
    if (newFilters.dateFrom) {
      const fromDate = new Date(newFilters.dateFrom);
      filtered = filtered.filter(movement => 
        new Date(movement.createdAt) >= fromDate
      );
    }
    
    if (newFilters.dateTo) {
      const toDate = new Date(newFilters.dateTo + 'T23:59:59');
      filtered = filtered.filter(movement => 
        new Date(movement.createdAt) <= toDate
      );
    }

    setFilteredMovements(filtered);
  };

  // Función para mostrar kardex
  const handleViewKardex = (productId: string) => {
    setSelectedProductId(productId);
    setShowKardex(true);
  };

  // Función para cerrar el formulario
  const handleCloseForm = () => {
    setShowForm(false);
  };

  // Función para cerrar el modal de kardex
  const handleCloseKardex = () => {
    setShowKardex(false);
    setSelectedProductId('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>

          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Movimiento</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Movimientos</p>
                <p className="text-2xl font-semibold text-gray-900">{movements.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entradas</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {movements.filter(m => m.type === 'entrada').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Plus className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Salidas</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {movements.filter(m => m.type === 'salida').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Plus className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ajustes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {movements.filter(m => m.type === 'ajuste').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <MovementFilters onFilter={handleFiltersChange} />
        </div>

        {/* Lista de movimientos */}
        <div className="mb-6">
          <MovementsList
            movements={filteredMovements}
            onViewKardex={handleViewKardex}
          />
        </div>

        {/* Modal del formulario */}
        {showForm && (
          <MovementForm
            onSubmit={handleAddMovement}
            onClose={handleCloseForm}
          />
        )}

        {/* Modal del kardex */}
        {showKardex && (
          <KardexModal
            productId={selectedProductId}
            onClose={handleCloseKardex}
          />
        )}
      </div>
    </div>
  );
};

export default MovementView;
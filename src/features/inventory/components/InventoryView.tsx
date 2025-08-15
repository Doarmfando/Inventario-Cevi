import React, { useState, useEffect } from "react";
import { Plus, BarChart3, ChefHat, AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { useInventory } from "../hooks/useInventory";
import type { NewProduct, ViewType } from "../types";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
// import DashboardView from "../../dashboard/components/DashboardView";

const InventoryView: React.FC = () => {
  const { 
    products, 
    addProduct, 
    deleteProduct, 
    updateProductStates, 
    getStats, 
    getExpiringProducts,
    getLowStockProducts 
  } = useInventory();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('inventory');

  // Actualizar estados de productos cada vez que se carga el componente
  useEffect(() => {
    updateProductStates();
  }, []);

  const handleAddProduct = (product: NewProduct) => {
    addProduct(product);
    setIsModalOpen(false);
  };

  const stats = getStats();
  const expiringProducts = getExpiringProducts();
  const lowStockProducts = getLowStockProducts();

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header con navegación */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
                <p className="text-sm text-gray-500">Restaurante - Sistema de Inventario</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setCurrentView('inventory')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Inventario
              </button>
            </nav>
          </div>
        </header>

        {/* Dashboard Content - Placeholder por ahora */}
        <main className="p-6">
          <div className="text-center py-20">
            <ChefHat className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Dashboard en Desarrollo</h2>
            <p className="text-gray-500">El panel de control estará disponible próximamente</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <ChefHat className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Inventario de Restaurante</h1>
              <p className="text-sm text-gray-500">Gestión de ingredientes y suministros</p>
            </div>
          </div>
          <nav className="flex space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentView('inventory')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Inventario
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Producto</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Alertas importantes */}
      {(expiringProducts.length > 0 || lowStockProducts.length > 0) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 mt-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Alertas de Inventario</h3>
              <div className="mt-1 text-sm text-yellow-700 space-x-4">
                {expiringProducts.length > 0 && (
                  <span className="inline-flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {expiringProducts.length} producto(s) por vencer o vencidos
                  </span>
                )}
                {lowStockProducts.length > 0 && (
                  <span className="inline-flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {lowStockProducts.length} producto(s) con stock bajo
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ChefHat className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  S/ {stats.totalValue.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-bold text-orange-600">{stats.lowStockItems}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Por Vencer</p>
                <p className="text-2xl font-bold text-red-600">{stats.expiringItems + stats.expiredItems}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de productos */}
        <ProductTable products={products} onDelete={deleteProduct} />
      </div>

      {/* Modal de formulario */}
      {isModalOpen && (
        <ProductForm
          onSubmit={handleAddProduct}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default InventoryView;
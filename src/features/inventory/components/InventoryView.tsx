import React, { useState } from "react";
import { Plus, BarChart3 } from "lucide-react";
import { useInventory } from "../hooks/useInventory";
import type { NewProduct, ViewType } from "../types";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import DashboardView from "../../dashboard/components/DashboardView";

const InventoryView: React.FC = () => {
  const { products, addProduct, deleteProduct } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('inventory');

  const handleAddProduct = (product: NewProduct) => {
    addProduct(product);
    setIsModalOpen(false);
  };

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header con navegación */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
            <nav className="flex space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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

        <DashboardView />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Inventario</h1>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Inventario
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Producto</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="p-6">
        <ProductTable products={products} onDelete={deleteProduct} />
      </main>

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
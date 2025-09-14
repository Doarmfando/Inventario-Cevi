import React, { useState, useEffect } from "react";
import { useInventory } from "../../hooks/useInventory";
import type { FormularioProducto } from "../../types";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import AlertsPanel from "./AlertsPanel";
import StatsCards from "./StatsCards";

const InventoryView: React.FC = () => {
  const { 
    products, 
    categorias,
    unidades,
    contenedores,
    loading,
    error,
    addProduct, 
    deleteProduct, 
    refreshProducts,
    getStats, 
    getExpiringProducts,
    getLowStockProducts 
  } = useInventory();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Actualizar estados de productos al montar
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const handleAddProduct = async (product: FormularioProducto) => {
    console.log("🎯 handleAddProduct ejecutado con:", product);
    
    try {
      const success = await addProduct(product);
      if (success) {
        console.log("✅ Producto agregado exitosamente, cerrando modal");
        setIsModalOpen(false);
      } else {
        console.error("❌ Error: addProduct retornó false");
        // TODO: Mostrar mensaje de error al usuario
        alert("Error al agregar el producto");
      }
    } catch (error) {
      console.error("❌ Error al agregar producto:", error);
      alert("Error al agregar el producto");
    }
  };

  const stats = getStats();
  const expiringProducts = getExpiringProducts();
  const lowStockProducts = getLowStockProducts();

  // Mostrar error si existe
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm font-bold">!</span>
            </div>
            <div>
              <h3 className="text-red-800 font-semibold">Error del Sistema</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Recargar Página
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mt-6" />

      {/* Componente de Alertas */}
      <AlertsPanel 
        expiringProducts={expiringProducts}
        lowStockProducts={lowStockProducts}
      />

      {/* Contenido principal */}
      <div className="p-6 pt-4">
        {/* Componente de Estadísticas */}
        <StatsCards stats={stats} />

        {/* Tabla de productos */}
        <ProductTable 
          products={products} 
          onDelete={deleteProduct}
          onAddProduct={() => {
            console.log("🔥 Abriendo modal");
            setIsModalOpen(true);
          }}
        />
      </div>

      {/* Modal de formulario */}
      {isModalOpen && (
        <ProductForm
          onSubmit={handleAddProduct}
          onClose={() => {
            console.log("🚪 Cerrando modal");
            setIsModalOpen(false);
          }}
          categories={categorias}
          units={unidades}
          containers={contenedores}
        />
      )}
      
      {/* Loading overlay global */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Cargando datos del inventario...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
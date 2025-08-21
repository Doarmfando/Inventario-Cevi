import React, { useState, useEffect } from "react";
import { useInventory } from "../../hooks/useInventory";
import type { NewProduct } from "../../types";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import AlertsPanel from "./AlertsPanel";
import StatsCards from "./StatsCards";

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
  
  console.log("🔧 InventoryView renderizado, addProduct type:", typeof addProduct);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Actualizar estados de productos cada vez que se carga el componente
  useEffect(() => {
    updateProductStates();
  }, []);

  const handleAddProduct = (product: NewProduct) => {
    console.log("🎯 handleAddProduct ejecutado con:", product);
    console.log("📤 Llamando addProduct...");
    addProduct(product);
    console.log("✅ addProduct ejecutado, cerrando modal");
    setIsModalOpen(false);
  };

  const stats = getStats();
  const expiringProducts = getExpiringProducts();
  const lowStockProducts = getLowStockProducts();

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
        />
      )}
    </div>
  );
};

export default InventoryView;
import React, { useState } from "react";
import type { NewProduct } from "../types/index.ts"; // ✅ Correcto
interface Props {
  onSubmit: (product: NewProduct) => void;
  onClose: () => void;
}

const ProductForm: React.FC<Props> = ({ onSubmit, onClose }) => {
  const [form, setForm] = useState<NewProduct>({
    name: "",
    category: "",
    price: 0,
    stock: 0
  });

  const handleChange = (field: keyof NewProduct) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: field === "price" || field === "stock" ? Number(e.target.value) : e.target.value }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Agregar Producto</h2>
        <div className="space-y-4">
          <input type="text" placeholder="Nombre" value={form.name} onChange={handleChange("name")} className="border p-2 w-full rounded" />
          <input type="text" placeholder="Categoría" value={form.category} onChange={handleChange("category")} className="border p-2 w-full rounded" />
          <input type="number" placeholder="Precio" value={form.price} onChange={handleChange("price")} className="border p-2 w-full rounded" />
          <input type="number" placeholder="Stock" value={form.stock} onChange={handleChange("stock")} className="border p-2 w-full rounded" />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
          <button onClick={() => onSubmit(form)} className="px-4 py-2 bg-blue-600 text-white rounded">Agregar</button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;

import React from "react";
import FormField from "./FormField";
import type { NewProduct } from "../../types";

interface StateSelectorProps {
  form: NewProduct;
  onChange: (field: keyof NewProduct) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const StateSelector: React.FC<StateSelectorProps> = ({ form, onChange }) => {
  const states = [
    { value: "fresco", label: "Fresco", color: "text-green-600 focus:ring-green-500" },
    { value: "congelado", label: "Congelado", color: "text-blue-600 focus:ring-blue-500" }
  ];

  return (
    <FormField
      label="Estado Inicial"
      required
    >
      <div className="flex space-x-4">
        {states.map(state => (
          <label key={state.value} className="flex items-center">
            <input
              type="radio"
              value={state.value}
              checked={form.state === state.value}
              onChange={onChange("state")}
              className={`mr-2 ${state.color}`}
            />
            <span className="text-sm text-gray-700">{state.label}</span>
          </label>
        ))}
      </div>
    </FormField>
  );
};

export default StateSelector;
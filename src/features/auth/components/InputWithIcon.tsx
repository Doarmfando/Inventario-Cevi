import React from "react";
import type { InputWithIconProps } from "../types/index.ts";

const InputWithIcon: React.FC<InputWithIconProps> = ({
  icon,
  type = "text",
  placeholder,
  label = "",
  value,
  onChange,
  name
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1 font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="flex items-center bg-white border-2 border-[#2f50ac] rounded-full px-4 h-12">
        <div className="mr-2 text-[#2f50ac] flex items-center text-lg">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          className="flex-1 bg-white text-black border-none outline-none text-base px-3 py-2 rounded-full"
        />
      </div>
    </div>
  );
};

export default InputWithIcon;
import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import type { PasswordInputProps } from "../types";

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = "Contraseña",
  disabled = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      <div className="relative flex items-center bg-white border-2 border-[#2f50ac] rounded-full px-4 h-12">
        <div className="mr-2 text-[#2f50ac] flex items-center text-lg">
          <Lock className="w-5 h-5" />
        </div>

        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="flex-1 bg-white text-black border-none outline-none text-base px-3 py-2 rounded-full pr-10 password-input disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-transparent border-none p-1 cursor-pointer text-[#2f50ac] flex items-center justify-center hover:text-[#1a3a7a] focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
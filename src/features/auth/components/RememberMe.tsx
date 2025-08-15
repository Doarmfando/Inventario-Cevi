import React from "react";
import type { RememberMeProps } from "../types/index.ts";

const RememberMe: React.FC<RememberMeProps> = ({ checked, onChange }) => {
  return (
    <div className="flex items-center gap-1.5 text-base font-medium text-[#2f50ac] mt-3">
      <label htmlFor="remember" className="cursor-pointer">
        Recuérdame
      </label>
      <input
        type="checkbox"
        id="remember"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4.5 h-4.5 cursor-pointer m-0"
        style={{ accentColor: '#2f50ac' }}
      />
    </div>
  );
};

export default RememberMe;
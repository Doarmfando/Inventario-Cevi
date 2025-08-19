import React from "react";

interface OriginalLeftPanelProps {
  children?: React.ReactNode;
}

const OriginalLeftPanel: React.FC<OriginalLeftPanelProps> = ({ children }) => {
  return (
    <div className="w-[16%] h-screen ml-5 bg-[#214480] rounded-tl-3xl rounded-bl-none shadow-[2px_0_10px_rgba(0,0,0,0.1)] flex items-start justify-center pt-16 z-20 login-left-panel">
      {children}
      
      {/* Estilos responsivos */}
      <style>
        {`
          @media (max-width: 768px) {
            .login-left-panel {
              width: 100% !important;
              height: auto !important;
              margin-left: 0 !important;
              border-radius: 0 !important;
              justify-content: center;
              padding: 20px 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default OriginalLeftPanel;
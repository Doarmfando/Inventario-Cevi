import React, { useState } from "react";
import { User, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { Credentials } from "../types";
import CirclesBackground from "./CirclesBackground";
import InputWithIcon from "./InputWithIcon";
import PasswordInput from "./PasswordInput";
import RememberMe from "./RememberMe";
import logo3 from "../../../assets/logo3.png";
import RestaurantLogo from "./RestaurantLogo";

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials>({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (credentials.username === "admin" && credentials.password === "admin123") {
        login(credentials.username);
        navigate("/dashboard", { replace: true });
      } else {
        alert("Credenciales incorrectas. Usa: admin / admin123");
      }
      setIsLoading(false);
    }, 800);
  };

  const handleInputChange = (field: keyof Credentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="font-['Segoe_UI'] relative min-h-screen w-full">
      {/* Fondo animado - FIJO para toda la pantalla */}
      <CirclesBackground />

      <div className="flex h-screen w-screen relative flex-row z-10 login-wrapper">
        {/* Panel izquierdo azul */}
        <div className="w-[16%] h-screen ml-5 bg-[#214480] rounded-tl-3xl rounded-bl-none shadow-[2px_0_10px_rgba(0,0,0,0.1)] flex items-start justify-center pt-16 z-20 login-left-panel">
          <RestaurantLogo  />
        </div>

        {/* Contenido principal */}
        <div className="w-[80%] flex items-center justify-center bg-transparent relative z-20 login-main-content">
          {/* Tarjeta de login */}
          <div className="w-full max-w-[400px] bg-white/95 backdrop-blur-sm p-12 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex flex-col gap-8 z-30 login-card">
            {/* Header con título animado */}
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-[#2f50ac] via-[#2f50ac] via-[#fff212] via-[#2f50ac] to-[#2f50ac] bg-[length:300%_100%] bg-clip-text text-transparent animate-rayFlash">
                Inicia Sesión
              </h1>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <InputWithIcon
                icon={<User className="w-5 h-5" />}
                placeholder="Usuario o correo"
                value={credentials.username}
                onChange={handleInputChange('username')}
                name="username"
              />
              
              <PasswordInput
                value={credentials.password}
                onChange={handleInputChange('password')}
                placeholder="Contraseña"
              />
              
              <RememberMe
                checked={rememberMe}
                onChange={setRememberMe}
              />
              
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-br from-[#2f50ac] to-[#1d3d8d] text-white p-3 text-base font-semibold border-none rounded-lg cursor-pointer transition-all duration-300 outline-none hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Iniciando sesión..." : "Acceder"}
              </button>
            </form>
          </div>
        </div>

        {/* Banner inferior */}
        <div className="absolute bottom-5 left-0 w-screen bg-[#F0F2F5]/90 backdrop-blur-sm py-4 px-6 flex items-center justify-between font-bold text-sm z-40 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] login-bottom-banner">
          {/* Logo y powered by */}
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src={logo3} 
                alt="Fortex Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[#2f50ac]">Powered by Fortex</span>
          </div>

          {/* Información de contacto */}
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-xs">Contacto:</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#2f50ac]" />
                <span className="text-[#2f50ac] text-xs">984 229 446</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#2f50ac]" />
                <span className="text-[#2f50ac] text-xs">944 532 822</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos globales para animaciones */}
      <style>
        {`
          @keyframes rayFlash {
            0% {
              background-position: 200% 0%;
            }
            100% {
              background-position: -100% 0%;
            }
          }

          .animate-rayFlash {
            animation: rayFlash 3s infinite linear;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .login-wrapper {
              flex-direction: column;
            }
            
            .login-left-panel {
              width: 100% !important;
              height: auto !important;
              margin-left: 0 !important;
              border-radius: 0 !important;
              justify-content: center;
              padding: 20px 0;
            }
            
            .login-main-content {
              width: 100% !important;
              padding: 20px;
            }
            
            .login-card {
              max-width: 90% !important;
              padding: 30px 20px !important;
            }
            
            .login-bottom-banner {
              position: relative !important;
              bottom: 0;
              width: 90% !important;
              margin: 20px auto 0;
              justify-content: center;
              text-align: center;
              font-size: 12px;
              flex-direction: column !important;
              gap: 10px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoginForm;
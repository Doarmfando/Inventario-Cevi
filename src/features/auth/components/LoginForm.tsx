import React, { useState } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { Credentials } from "../types";
import CirclesBackground from "./CirclesBackground";
import InputWithIcon from "./InputWithIcon";
import PasswordInput from "./PasswordInput";
import RememberMe from "./RememberMe";
import logo3 from "../../../assets/logo3.png";
import FooterBanner from "./FooterBanner";
import LeftPanel from "./LeftPanel";
import RestaurantLogo from "./RestaurantLogo";
import leftPanelImage from "../../../assets/left-panel-bg.png";

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

      <div className="flex h-screen w-screen relative z-10 login-wrapper">
        {/* Panel izquierdo - Mantiene su ancho original en desktop, se oculta en móvil */}
        <LeftPanel 
          panelImage={leftPanelImage}
          altText="Panel lateral del login"
        >
          <RestaurantLogo />
        </LeftPanel>
       
        {/* Contenido principal */}
        <div className="flex-1 flex items-center justify-center bg-transparent relative z-20 login-main-content px-4 md:px-0">
          {/* Tarjeta de login */}
          <div className="w-full max-w-[400px] bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex flex-col gap-6 md:gap-8 z-30 login-card">
            {/* Header con título animado */}
            <div className="flex flex-col items-center">
              <h1
                className="text-3xl md:text-4xl font-extrabold text-center 
                  bg-gradient-to-r from-[#2f50ac] via-[#fff212] to-[#2f50ac]
                  bg-[length:200%_100%] bg-clip-text text-transparent animate-rayFlash"
              >
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
                className="bg-[#1E3A8A] text-white p-3 text-base font-semibold rounded-lg cursor-pointer transition-all duration-300 outline-none hover:bg-[#2A4FB0] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Iniciando sesión..." : "Acceder"}
              </button>
            </form>
          </div>
        </div>

        {/* Banner inferior - Solo visible en desktop */}
        <FooterBanner 
          logo={logo3}
          logoAlt="Fortex Logo"
          companyName="Fortex"
          contactLabel="Contacto:"
          phoneNumbers={["984 229 446", "944 532 822"]}
          version="1.0.0"
        />
      </div>

      <style>
        {`
          @keyframes rayFlash {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 200% 50%;
            }
          }

          .animate-rayFlash {
            animation: rayFlash 3s linear infinite alternate;
          }

          /* Ocultar iconos nativos del navegador en campos de contraseña */
          .password-input::-ms-reveal,
          .password-input::-webkit-textfield-decoration-container,
          .password-input::-webkit-credentials-auto-fill-button,
          .password-input::-webkit-strong-password-auto-fill-button {
            display: none !important;
          }

          /* Responsive styles */
          @media (max-width: 768px) {
            /* Ocultar el panel izquierdo en móvil */
            .left-panel {
              display: none !important;
            }
            
            /* Ocultar el banner en móvil */
            .login-bottom-banner {
              display: none !important;
            }
            
            .login-main-content {
              height: 100vh;
              width: 100% !important;
              padding: 20px;
            }

            .login-card {
              margin: auto;
              max-width: 350px;
              padding: 24px;
            }

            /* Asegurar que el fondo cubra toda la pantalla en móvil */
            .min-h-screen {
              min-height: 100vh;
              min-height: 100svh; /* Para navegadores que soportan viewport units */
            }
          }

          @media (max-width: 480px) {
            .login-card {
              max-width: 320px;
              padding: 20px;
              gap: 20px;
            }
            
            .login-main-content {
              padding: 16px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoginForm;
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
//import OriginalLeftPanel from "./OriginalLeftPanel";
import FooterBanner from "./FooterBanner";
// Si quieres usar el panel con imagen, importa esto en su lugar:
import LeftPanel from "./LeftPanel";
import RestaurantLogo from "./RestaurantLogo";
import leftPanelImage from "../../../assets/left-panel-bg.png"; // Ajusta la ruta según tu estructura

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
        {/* Panel izquierdo azul original */}
        {/* <OriginalLeftPanel>
          <RestaurantLogo />
        </OriginalLeftPanel>
         */}
        {/* Si quieres usar el panel con imagen, usa esto en su lugar: */}
        <LeftPanel 
          panelImage={leftPanelImage}
          altText="Panel lateral del login"
        >
          <RestaurantLogo />
        </LeftPanel>
       
        {/* Contenido principal */}
        <div className="w-[80%] flex items-center justify-center bg-transparent relative z-20 login-main-content">
          {/* Tarjeta de login */}
          <div className="w-full max-w-[400px] bg-white/95 backdrop-blur-sm p-12 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex flex-col gap-8 z-30 login-card">
            {/* Header con título animado */}
            <div className="flex flex-col items-center">
              <h1
                className="text-4xl font-extrabold text-center 
                  bg-gradient-to-r from-[#2f50ac] via-[#fff212] to-[#2f50ac]
                  bg-[length:200%_100%] bg-clip-text text-transparent animate-rayFlash"
              >
                Inicia Sesión
              </h1>


              {/* 
              <h1
                className="text-4xl font-extrabold text-center 
                  bg-gradient-to-r from-[#2f50ac] via-[#fff212] to-[#2f50ac]
                  bg-clip-text text-transparent"
              >
                Inicia Sesión
              </h1>
              */}

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

        {/* Banner inferior como componente */}
        <FooterBanner 
          logo={logo3}
          logoAlt="Fortex Logo"
          companyName="Fortex"
          contactLabel="Contacto:"
          phoneNumbers={["984 229 446", "944 532 822"]}
          version="1.0.0"  // 👈 Agregar esta línea

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
            `}
            </style>


    </div>
  );
};

export default LoginForm;

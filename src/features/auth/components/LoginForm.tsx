// src/features/auth/components/LoginForm.tsx
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
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Iniciando proceso de login...');
      console.log('📝 Input usuario:', credentials.username);
      console.log('🔑 Contraseña proporcionada:', credentials.password ? 'Sí' : 'No');

      // Validar que ambos campos estén llenos
      if (!credentials.username.trim() || !credentials.password) {
        setError('Por favor ingresa usuario/email y contraseña');
        return;
      }

      // Usar directamente lo que el usuario ingresó (puede ser email o username)
      const success = await login(credentials.username.trim(), credentials.password);
      console.log('✅ Resultado del login:', success);
      
      if (success) {
        console.log('🎉 Login exitoso, redirigiendo al dashboard...');
        navigate("/dashboard", { replace: true });
      } else {
        console.error('❌ Login falló');
        setError("Credenciales incorrectas. Verifica tu usuario/email y contraseña.");
      }
    } catch (error) {
      console.error('💥 Error en handleSubmit:', error);
      setError(`Error al iniciar sesión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Credentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError(null); // Limpiar error al escribir
  };

  return (
    <div className="font-['Segoe_UI'] relative min-h-screen w-full">
      <CirclesBackground />

      <div className="flex h-screen w-screen relative z-10 login-wrapper">
        <LeftPanel panelImage={leftPanelImage} altText="Panel lateral del login">
          <RestaurantLogo />
        </LeftPanel>
       
        <div className="flex-1 flex items-center justify-center bg-transparent relative z-20 login-main-content px-4 md:px-0">
          <div className="w-full max-w-[400px] bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex flex-col gap-6 md:gap-8 z-30 login-card">
            <div className="flex flex-col items-center">
              <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-[#2f50ac] via-[#fff212] to-[#2f50ac] bg-[length:200%_100%] bg-clip-text text-transparent animate-rayFlash">
                Inicia Sesión
              </h1>
            </div>

            {/* Mostrar error si existe */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Panel de debugging temporal */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded text-xs">
                <strong>Debug:</strong> {credentials.username ? `Usuario/Email: ${credentials.username}` : 'Ingresa usuario o email'}
                <br />
                <em>Puedes usar: fabio, brando, o emails completos</em>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <InputWithIcon
                icon={<User className="w-5 h-5" />}
                placeholder="Usuario o correo electrónico"
                value={credentials.username}
                onChange={handleInputChange('username')}
                name="username"
                disabled={isLoading}
              />
              
              <PasswordInput
                value={credentials.password}
                onChange={handleInputChange('password')}
                placeholder="Contraseña"
                disabled={isLoading}
              />
              
              <RememberMe checked={rememberMe} onChange={setRememberMe} />
              
              <button
                type="submit"
                disabled={isLoading || !credentials.username || !credentials.password}
                className="bg-[#1E3A8A] text-white p-3 text-base font-semibold rounded-lg cursor-pointer transition-all duration-300 outline-none hover:bg-[#2A4FB0] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Iniciando sesión...
                  </span>
                ) : (
                  "Acceder"
                )}
              </button>
            </form>

            {/* Información de credenciales de prueba */}
            <div className="text-xs text-gray-500 text-center p-3 bg-gray-50 rounded-lg">
              <strong>Usuarios disponibles:</strong><br />
              <span className="text-green-600">fabio</span> o <span className="text-green-600">fabio@restaurantenoemi.com</span><br />
              <span className="text-green-600">brando</span> o <span className="text-green-600">brandoarmas@hotmail.com</span><br />
              <span className="text-orange-600 text-[10px]">
                Usa la contraseña que configuraste en Supabase Auth
              </span>
            </div>
          </div>
        </div>

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
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }

          .animate-rayFlash {
            animation: rayFlash 3s linear infinite alternate;
          }

          .password-input::-ms-reveal,
          .password-input::-webkit-textfield-decoration-container,
          .password-input::-webkit-credentials-auto-fill-button,
          .password-input::-webkit-strong-password-auto-fill-button {
            display: none !important;
          }

          @media (max-width: 768px) {
            .left-panel { display: none !important; }
            .login-bottom-banner { display: none !important; }
            .login-main-content { height: 100vh; width: 100% !important; padding: 20px; }
            .login-card { margin: auto; max-width: 350px; padding: 24px; }
            .min-h-screen { min-height: 100vh; min-height: 100svh; }
          }

          @media (max-width: 480px) {
            .login-card { max-width: 320px; padding: 20px; gap: 20px; }
            .login-main-content { padding: 16px; }
          }
        `}
      </style>
    </div>
  );
};

export default LoginForm;
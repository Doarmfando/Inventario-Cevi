import React from "react";
import logo2 from "../../../assets/logo2.png";

const RestaurantLogoAdvanced: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-white space-y-3">

      {/* CEVICHERÍA con colores específicos por letra - ARRIBA DE LOS PUNTOS */}
      <div className="text-sm font-black uppercase tracking-widest drop-shadow-lg mb-2">
        <span style={{ color: '#FF0040' }}>C</span> {/* Fucsia */}
        <span style={{ color: '#00B14F' }}>E</span> {/* Verde */}
        <span style={{ color: '#0074FF' }}>V</span> {/* Celeste */}
        <span style={{ color: '#FFB400' }}>I</span> {/* Amarillo */}
        <span style={{ color: '#0074FF' }}>C</span> {/* Celeste */}
        <span style={{ color: '#00B14F' }}>H</span> {/* Verde */}
        <span style={{ color: '#8B5CF6' }}>E</span> {/* Morado */}
        <span style={{ color: '#EF4444' }}>R</span> {/* Rojo */}
        <span style={{ color: '#0074FF' }}>Í</span> {/* Celeste */}
        <span style={{ color: '#FFB400' }}>A</span> {/* Amarillo */}
      </div>

      {/* Puntos decorativos superiores - horizontales azules que cubren toda NOEMÍ */}
      <div className="flex space-x-1 mb-3">
        {Array.from({ length: 28 }).map((_, index) => (
          <div key={index} className="w-1 h-1 bg-blue-500 rounded-full"></div>
        ))}
      </div>
      
      {/* Texto del restaurante */}
      <div className="text-center">
        {/* NOEMÍ - MÁS GRANDE con gradientes individuales */}
        <div className="text-6xl font-black uppercase tracking-wider drop-shadow-xl relative flex items-center justify-center">
          {/* N - Amarillo a Azul */}
          <span 
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFB400 30%, #4A90E2 70%, #0074FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'saturate(1.3)'
            }}
          >
            N
          </span>
          
          {/* O - Azul a Verde */}
          <span 
            style={{
              background: 'linear-gradient(135deg, #0074FF 0%, #00BFFF 30%, #00FF7F 70%, #00B14F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'saturate(1.3)'
            }}
          >
            O
          </span>
          
          {/* E - Verde a Rojo */}
          <span 
            style={{
              background: 'linear-gradient(135deg, #00B14F 0%, #32CD32 30%, #FF6347 70%, #EF4444 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'saturate(1.3)'
            }}
          >
            E
          </span>
          
          {/* M - Rojo a Fucsia */}
          <span 
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #FF6B6B 30%, #FF1493 70%, #FF0040 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'saturate(1.3)'
            }}
          >
            M
          </span>
          
          {/* Í - Fucsia a Morado */}
          <span 
            style={{
              background: 'linear-gradient(135deg, #FF0040 0%, #FF1493 30%, #DA70D6 70%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'saturate(1.3)'
            }}
          >
            Í
          </span>
        </div>
        
        {/* Efecto de brillo adicional */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="text-6xl font-black uppercase tracking-wider opacity-20 mix-blend-screen"
            style={{
              background: 'linear-gradient(45deg, #FFFFFF 0%, #FFD700 25%, #00FFFF 50%, #FF69B4 75%, #FFFFFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 3s ease-in-out infinite alternate'
            }}
          >
            
          </div>
        </div>
      </div>
      
      {/* Puntos decorativos inferiores - horizontales azules que cubren toda NOEMÍ */}
      <div className="flex space-x-1 mt-3">
        {Array.from({ length: 28 }).map((_, index) => (
          <div key={index} className="w-1 h-1 bg-blue-500 rounded-full"></div>
        ))}
      </div>
      
      {/* Estilos para animación de brillo */}
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -100% 0%;
            }
            100% {
              background-position: 200% 0%;
            }
          }
        `}
      </style>


                  {/* Logo */}
      <div className="w-16 h-16 mb-2">
        <img 
          src={logo2} 
          alt="Cevichería Noemí Logo" 
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>

    </div>
  );
};



export default RestaurantLogoAdvanced;
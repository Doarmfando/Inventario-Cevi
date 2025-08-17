import React, { useState } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

// Datos mock para tendencias (en tu app real vendrían de tu API)
const mockTrendData = [
  { date: '1 Ago', totalValue: 1400, totalProducts: 7, movements: 2 },
  { date: '2 Ago', totalValue: 1500, totalProducts: 8, movements: 3 },
  { date: '3 Ago', totalValue: 1550, totalProducts: 8, movements: 1 },
  { date: '4 Ago', totalValue: 1480, totalProducts: 8, movements: 2 },
  { date: '5 Ago', totalValue: 1620, totalProducts: 8, movements: 4 },
  { date: '6 Ago', totalValue: 1626, totalProducts: 8, movements: 1 },
];

const mockMovementData = [
  { day: 'Lun', entradas: 12, salidas: 8, ajustes: 1 },
  { day: 'Mar', entradas: 8, salidas: 15, ajustes: 0 },
  { day: 'Mié', entradas: 20, salidas: 12, ajustes: 2 },
  { day: 'Jue', entradas: 15, salidas: 18, ajustes: 1 },
  { day: 'Vie', entradas: 10, salidas: 22, ajustes: 0 },
  { day: 'Sab', entradas: 5, salidas: 8, ajustes: 1 },
  { day: 'Dom', entradas: 3, salidas: 5, ajustes: 0 },
];

const InventoryTrends: React.FC = () => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  
  // Calcular tendencias
  const currentValue = mockTrendData[mockTrendData.length - 1]?.totalValue || 0;
  const previousValue = mockTrendData[mockTrendData.length - 2]?.totalValue || 0;
  const valueChange = currentValue - previousValue;
  const valueChangePercent = previousValue > 0 ? ((valueChange / previousValue) * 100) : 0;

  const totalMovements = mockMovementData.reduce((sum, day) => 
    sum + day.entradas + day.salidas + day.ajustes, 0
  );
  const totalEntradas = mockMovementData.reduce((sum, day) => sum + day.entradas, 0);
  const totalSalidas = mockMovementData.reduce((sum, day) => sum + day.salidas, 0);

  // Función para crear path del gráfico de línea
  const createLinePath = (data: typeof mockTrendData, key: 'totalValue' | 'totalProducts') => {
    const maxValue = Math.max(...data.map(d => d[key]));
    const minValue = Math.min(...data.map(d => d[key]));
    const range = maxValue - minValue || 1;
    
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((item[key] - minValue) / range) * 80; // 80% del alto, 20% de padding
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="space-y-6">
      {/* Tendencias del valor del inventario */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Tendencias del Inventario
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {valueChange >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
              <span className={`font-semibold ${
                valueChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                S/{Math.abs(valueChange).toLocaleString()} 
                ({valueChangePercent >= 0 ? '+' : ''}{valueChangePercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden">
          <div className="h-80 relative">
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="10%" height="20%" patternUnits="userSpaceOnUse">
                  <path d="M 0 0 L 0 100 M 0 0 L 100 0" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Línea de valor total */}
              <path
                d={createLinePath(mockTrendData, 'totalValue')}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                className="drop-shadow-sm"
              />
              
              {/* Puntos de la línea */}
              {mockTrendData.map((item, index) => {
                const maxValue = Math.max(...mockTrendData.map(d => d.totalValue));
                const minValue = Math.min(...mockTrendData.map(d => d.totalValue));
                const range = maxValue - minValue || 1;
                const x = (index / (mockTrendData.length - 1)) * 100;
                const y = 100 - ((item.totalValue - minValue) / range) * 80;
                
                return (
                  <circle
                    key={index}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r={hoveredPoint === index ? "6" : "4"}
                    fill="#3B82F6"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}
              
              {/* Labels del eje X */}
              {mockTrendData.map((item, index) => (
                <text
                  key={index}
                  x={`${(index / (mockTrendData.length - 1)) * 100}%`}
                  y="95%"
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {item.date}
                </text>
              ))}
            </svg>
            
            {/* Tooltip */}
            {hoveredPoint !== null && (
              <div 
                className="absolute bg-gray-800 text-white px-3 py-2 rounded shadow-lg text-sm pointer-events-none z-10"
                style={{
                  left: `${(hoveredPoint / (mockTrendData.length - 1)) * 100}%`,
                  top: '10%',
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="font-medium">{mockTrendData[hoveredPoint].date}</div>
                <div>Valor: S/{mockTrendData[hoveredPoint].totalValue.toLocaleString()}</div>
                <div>Productos: {mockTrendData[hoveredPoint].totalProducts}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Movimientos por día */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Activity className="w-5 h-5 text-blue-500 mr-2" />
            Movimientos de la Semana
          </h3>
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold">{totalMovements}</span> movimientos
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 font-medium">Total Entradas</p>
                <p className="text-2xl font-bold text-green-600">{totalEntradas}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-800 font-medium">Total Salidas</p>
                <p className="text-2xl font-bold text-red-600">{totalSalidas}</p>
              </div>
              <TrendingDown className="w-6 h-6 text-red-500" />
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-800 font-medium">Balance Neto</p>
                <p className={`text-2xl font-bold ${
                  (totalEntradas - totalSalidas) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {totalEntradas - totalSalidas >= 0 ? '+' : ''}{totalEntradas - totalSalidas}
                </p>
              </div>
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="h-80 relative">
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Grid lines */}
              <defs>
                <pattern id="barGrid" width={`${100/mockMovementData.length}%`} height="10%" patternUnits="userSpaceOnUse">
                  <path d="M 0 0 L 0 100" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#barGrid)" />
              
              {/* Barras */}
              {mockMovementData.map((item, index) => {
                const maxValue = Math.max(...mockMovementData.map(d => d.entradas + d.salidas + d.ajustes));
                const barWidth = (100 / mockMovementData.length) * 0.8; // 80% del espacio disponible
                const barSpacing = (100 / mockMovementData.length) * 0.1; // 10% de cada lado
                const x = (index / mockMovementData.length) * 100 + barSpacing;
                
                const entradasHeight = (item.entradas / maxValue) * 70; // 70% del alto total
                const salidasHeight = (item.salidas / maxValue) * 70;
                const ajustesHeight = (item.ajustes / maxValue) * 70;
                
                const entradasY = 75 - entradasHeight; // Empezar desde el 75%
                const salidasY = entradasY - salidasHeight;
                const ajustesY = salidasY - ajustesHeight;
                
                return (
                  <g key={index}>
                    {/* Barra de ajustes */}
                    <rect
                      x={`${x}%`}
                      y={`${ajustesY}%`}
                      width={`${barWidth/3}%`}
                      height={`${ajustesHeight}%`}
                      fill="#F59E0B"
                      className={`transition-all duration-200 cursor-pointer ${
                        hoveredBar === index ? 'opacity-90' : 'opacity-80 hover:opacity-90'
                      }`}
                      onMouseEnter={() => setHoveredBar(index)}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                    
                    {/* Barra de entradas */}
                    <rect
                      x={`${x + barWidth/3}%`}
                      y={`${entradasY}%`}
                      width={`${barWidth/3}%`}
                      height={`${entradasHeight}%`}
                      fill="#10B981"
                      className={`transition-all duration-200 cursor-pointer ${
                        hoveredBar === index ? 'opacity-90' : 'opacity-80 hover:opacity-90'
                      }`}
                      onMouseEnter={() => setHoveredBar(index)}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                    
                    {/* Barra de salidas */}
                    <rect
                      x={`${x + (barWidth*2)/3}%`}
                      y={`${salidasY}%`}
                      width={`${barWidth/3}%`}
                      height={`${salidasHeight}%`}
                      fill="#EF4444"
                      className={`transition-all duration-200 cursor-pointer ${
                        hoveredBar === index ? 'opacity-90' : 'opacity-80 hover:opacity-90'
                      }`}
                      onMouseEnter={() => setHoveredBar(index)}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                    
                    {/* Label del día */}
                    <text
                      x={`${x + barWidth/2}%`}
                      y="90%"
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      {item.day}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            {/* Tooltip para barras */}
            {hoveredBar !== null && (
              <div 
                className="absolute bg-gray-800 text-white px-3 py-2 rounded shadow-lg text-sm pointer-events-none z-10"
                style={{
                  left: `${(hoveredBar / mockMovementData.length) * 100 + (100 / mockMovementData.length) * 0.5}%`,
                  top: '10%',
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="font-medium">{mockMovementData[hoveredBar].day}</div>
                <div className="text-green-300">Entradas: {mockMovementData[hoveredBar].entradas}</div>
                <div className="text-red-300">Salidas: {mockMovementData[hoveredBar].salidas}</div>
                <div className="text-yellow-300">Ajustes: {mockMovementData[hoveredBar].ajustes}</div>
              </div>
            )}
          </div>
          
          {/* Leyenda */}
          <div className="mt-4 flex justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Entradas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Salidas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600">Ajustes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTrends;

import React, { useState } from "react";

interface CategoryData {
  category: string;
  count: number;
  value: number;
}

interface CategorySummaryProps {
  categoryStats: CategoryData[];
}

const CategorySummary: React.FC<CategorySummaryProps> = ({ categoryStats }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Colores para el gráfico
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#06B6D4', // cyan
    '#F97316', // orange
    '#84CC16'  // lime
  ];

  const totalValue = categoryStats.reduce((sum, cat) => sum + cat.value, 0);
  
  // Calcular ángulos para el gráfico de dona
  let currentAngle = 0;
  const segments = categoryStats.map((item, index) => {
    const percentage = totalValue > 0 ? (item.value / totalValue) : 0;
    const angle = percentage * 360;
    const segment = {
      ...item,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: colors[index % colors.length]
    };
    currentAngle += angle;
    return segment;
  });

  // Función para crear path del segmento
  const createArcPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", centerX, centerY,
      "L", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Resumen por Categorías
        </h3>
        <span className="text-sm text-gray-600">
          Valor Total: <span className="font-semibold">S/{totalValue.toLocaleString()}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de categorías */}
        <div className="space-y-4">
          {categoryStats.map((item, index) => {
            const percentage = totalValue > 0 ? (item.value / totalValue * 100) : 0;
            const isHovered = hoveredIndex === index;
            
            return (
              <div 
                key={item.category} 
                className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                  isHovered ? 'bg-gray-100 shadow-md transform scale-105' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      isHovered ? 'w-5 h-5' : ''
                    }`}
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.category}</p>
                    <p className="text-sm text-gray-600">{item.count} productos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">S/{item.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gráfico de dona personalizado */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width="300" height="300" className="transform -rotate-90">
              {segments.map((segment, index) => (
                <path
                  key={segment.category}
                  d={createArcPath(150, 150, 100, segment.startAngle, segment.endAngle)}
                  fill={segment.color}
                  className={`transition-all duration-300 cursor-pointer ${
                    hoveredIndex === index ? 'opacity-90 drop-shadow-lg' : 'opacity-80 hover:opacity-90'
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              ))}
              
              {/* Centro blanco para crear efecto de dona */}
              <circle cx="150" cy="150" r="50" fill="white" />
            </svg>
            
            {/* Texto central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">
                  S/{totalValue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
            
            {/* Tooltip */}
            {hoveredIndex !== null && (
              <div className="absolute top-0 left-0 transform -translate-x-full -translate-y-2 bg-gray-800 text-white px-3 py-2 rounded shadow-lg text-sm">
                <div className="font-medium">{segments[hoveredIndex].category}</div>
                <div>S/{segments[hoveredIndex].value.toLocaleString()} ({segments[hoveredIndex].percentage.toFixed(1)}%)</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySummary;

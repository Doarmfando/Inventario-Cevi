// CirclesBackground.tsx
import React from 'react';
import './CirclesBackground.css'; // Importamos el CSS

const CirclesBackground: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="circle absolute block rounded-full"
          style={{ bottom: '-150px' }}
        />
      ))}
    </div>
  );
};

export default CirclesBackground;
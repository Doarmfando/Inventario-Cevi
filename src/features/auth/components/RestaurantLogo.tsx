import React from "react";
import logo2 from "../../../assets/logo2.png";
import logoblanco from "../../../assets/logo-blanco.png";

const RestaurantLogo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full px-4">
      {/* Logo principal del restaurante */}
      {/* <div>
        <img 
          src={logo1} 
          alt="Restaurant Logo" 
          className="w-40 h-40 object-contain"
        />
      </div> */}
      
      <div>
        <img 
          src={logoblanco} 
          alt="Restaurant Logo" 
          className="w-40 h-40 object-contain"
        />
      </div>

      {/* Logo secundario */}
      <div>
        <img 
          src={logo2} 
          alt="Restaurant Brand" 
          className="w-36 h-20 object-contain"
        />
      </div>
    </div>
  );
};

export default RestaurantLogo;
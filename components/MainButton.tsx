import React, { useRef, useEffect } from 'react';

interface MainButtonProps {
  onPressStart: () => void;
  onPressEnd: () => void;
  pressure: number; // 0 to 1
}

export const MainButton: React.FC<MainButtonProps> = ({ onPressStart, onPressEnd, pressure }) => {
  // We use standard React events for mouse, and touch events for mobile
  // to prevent defaults like context menus or scrolling
  
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    onPressStart();
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    onPressEnd();
  };

  // Visual jitter based on pressure
  const jitterX = pressure > 0 ? (Math.random() - 0.5) * pressure * 10 : 0;
  const jitterY = pressure > 0 ? (Math.random() - 0.5) * pressure * 10 : 0;

  return (
    <div className="relative flex items-center justify-center">
      {/* Pressure Gauge Visualization behind button */}
      <div 
         className="absolute w-full h-full rounded-full border-4 border-black border-dashed opacity-50 animate-spin-slow"
         style={{ 
           transform: `scale(${1 + pressure * 0.5}) rotate(${pressure * 360}deg)`,
           animationDuration: `${2 - pressure * 1.8}s`
         }} 
      />
      
      <button
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="
          relative w-48 h-48 md:w-64 md:h-64 rounded-full
          bg-red-500 brutal-border brutal-shadow
          active:brutal-shadow-active active:translate-x-2 active:translate-y-2
          flex flex-col items-center justify-center
          transition-transform duration-75 no-select z-10
        "
        style={{
           transform: `translate(${jitterX}px, ${jitterY}px) scale(${1 - pressure * 0.1})`,
           backgroundColor: pressure > 0.8 ? '#FF0000' : '#EF4444' // Bright red at max pressure
        }}
      >
        <span className="text-4xl md:text-5xl font-black text-white pointer-events-none">
          PUSH
        </span>
        <span className="text-sm font-bold bg-black text-white px-2 py-0.5 mt-2 transform rotate-2 pointer-events-none">
          {Math.round(pressure * 100)}% BAR
        </span>
      </button>
    </div>
  );
};
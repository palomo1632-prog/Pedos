import React from 'react';
import { Particle } from '../types';

interface SmokeManagerProps {
  particles: Particle[];
}

export const SmokeManager: React.FC<SmokeManagerProps> = ({ particles }) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-white brutal-border opacity-90"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg) scale(${p.life})`,
            opacity: p.life,
            transition: 'transform 0.1s linear, opacity 0.1s linear',
          }}
        >
          {/* Inner brutalist detail */}
          <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-black rounded-full opacity-20"></div>
        </div>
      ))}
    </div>
  );
};
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader } from './components/Loader';
import { MainButton } from './components/MainButton';
import { SoundSelector } from './components/SoundSelector';
import { SmokeManager } from './components/SmokeManager';
import { audioEngine } from './services/audioEngine';
import { SOUND_PROFILES, MAX_PITCH_MULTIPLIER, BASE_PITCH } from './constants';
import { SoundType, Particle, SoundProfile } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeSound, setActiveSound] = useState<SoundProfile>(SOUND_PROFILES[0]);
  const [pressure, setPressure] = useState(0); // 0.0 to 1.0
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const isPressingRef = useRef(false);
  const pressureRef = useRef(0);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  // Preload sounds on mount
  useEffect(() => {
    audioEngine.preload();
  }, []);

  const handleLoaded = async () => {
    await audioEngine.init();
    setLoading(false);
  };

  // Animation Loop for Pressure and Particles
  const loop = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const delta = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    // Handle Pressure Logic
    if (isPressingRef.current) {
      pressureRef.current = Math.min(pressureRef.current + delta * 0.5, 1.0); // Takes 2 seconds to max
    } else {
      pressureRef.current = 0; // Reset instantly on release (visual pop handled in release)
    }
    
    // Only update state if significantly changed to avoid too many re-renders, 
    // though React 18 handles this well.
    setPressure(pressureRef.current);

    // Handle Particles
    setParticles(prev => prev
      .map(p => ({
        ...p,
        x: p.x + p.vx * delta * 60,
        y: p.y + p.vy * delta * 60,
        life: p.life - delta * 0.8, // Fade out speed
        rotation: p.rotation + (Math.random() - 0.5) * 10
      }))
      .filter(p => p.life > 0)
    );

    requestRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [loop]);

  const handlePressStart = () => {
    isPressingRef.current = true;
  };

  const handlePressEnd = () => {
    if (!isPressingRef.current) return;
    isPressingRef.current = false;
    
    const finalPressure = pressureRef.current;
    
    // Play Sound
    const pitch = BASE_PITCH + (finalPressure * (MAX_PITCH_MULTIPLIER - 1));
    audioEngine.play(activeSound.id, pitch);

    // Spawn Particles (Brutalist Smoke)
    const particleCount = 5 + Math.floor(finalPressure * 10);
    const newParticles: Particle[] = [];
    
    // Center of screen
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 3; // Approx button center

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5 * (1 + finalPressure);
      newParticles.push({
        id: Date.now() + i,
        x: cx,
        y: cy,
        size: 40 + Math.random() * 60,
        rotation: Math.random() * 360,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
  };

  if (loading) {
    return <Loader onComplete={handleLoaded} />;
  }

  // Calculate zoom scale based on pressure.
  // We zoom the whole container IN to create claustrophobia.
  // Scale goes from 1 to 1.5
  const zoomScale = 1 + (pressure * 0.3);

  return (
    <div className="bg-yellow-500 min-h-screen w-full overflow-hidden relative font-sans text-black">
      {/* Background Grid Pattern (Brutalist style) */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
            backgroundImage: `linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
        }}
      />
      
      {/* Dynamic Container that zooms */}
      <div 
        className="w-full min-h-screen flex flex-col items-center pt-12 md:pt-20 transition-transform duration-75 ease-out will-change-transform"
        style={{ 
          transform: `scale(${zoomScale})`,
          transformOrigin: 'center 30%' // Focus zoom on the button area
        }}
      >
        <header className="mb-12 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-black bg-white inline-block px-4 py-2 brutal-border brutal-shadow transform -rotate-2">
            GASMASTER
          </h1>
          <div className="mt-2 text-xl font-bold bg-black text-white inline-block px-2 rotate-1">
            VER. 3.0
          </div>
        </header>

        <main className="flex-1 w-full max-w-lg flex flex-col items-center relative z-20">
          <MainButton 
            onPressStart={handlePressStart}
            onPressEnd={handlePressEnd}
            pressure={pressure}
          />
          
          <div className="mt-12 w-full px-4">
             <div className="bg-black text-white p-2 font-bold mb-2 text-center brutal-border border-white">
                SELECTOR DE MUNICIÓN
             </div>
             <SoundSelector 
                activeSoundId={activeSound.id}
                onSelect={setActiveSound}
             />
          </div>
        </main>
        
        <footer className="mt-auto pb-6 opacity-60 font-bold text-xs uppercase tracking-widest">
            Presión máxima garantizada
        </footer>
      </div>

      <SmokeManager particles={particles} />
    </div>
  );
};

export default App;
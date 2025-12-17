import React, { useEffect, useState } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setReady(true);
          return 100;
        }
        // Much faster loading: +5% every 20ms = ~400ms total
        return prev + 5; 
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-yellow-400 flex flex-col items-center justify-center p-8">
      {!ready ? (
        <>
          <h1 className="text-4xl md:text-6xl font-black mb-8 text-black tracking-tighter text-center leading-none">
            CARGANDO<br />GASES...
          </h1>
          <div className="w-full max-w-md h-12 brutal-border bg-white relative">
            <div 
              className="h-full bg-black transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 text-2xl font-bold">{progress}%</div>
        </>
      ) : (
        <button 
          onClick={onComplete}
          className="animate-pulse bg-black text-white text-4xl md:text-6xl font-black px-8 py-6 brutal-border border-white brutal-shadow hover:translate-y-1 hover:shadow-none transition-all active:scale-95"
        >
          INICIAR
        </button>
      )}
    </div>
  );
};
import React from 'react';
import { SoundProfile } from '../types';
import { SOUND_PROFILES } from '../constants';

interface SoundSelectorProps {
  activeSoundId: string;
  onSelect: (sound: SoundProfile) => void;
}

export const SoundSelector: React.FC<SoundSelectorProps> = ({ activeSoundId, onSelect }) => {
  return (
    <div className="w-full grid grid-cols-2 gap-4 mt-8 px-4">
      {SOUND_PROFILES.map((profile) => (
        <button
          key={profile.id}
          onClick={() => onSelect(profile)}
          className={`
            relative p-4 brutal-border h-24 flex items-center justify-center
            transition-all duration-100 no-select
            ${activeSoundId === profile.id 
              ? `bg-white brutal-shadow-sm translate-x-[2px] translate-y-[2px]` 
              : `${profile.color} brutal-shadow hover:-translate-y-1 hover:brutal-shadow-active`}
          `}
        >
          <span className="text-xl md:text-2xl font-black italic transform -rotate-2">
            {profile.label}
          </span>
          {activeSoundId === profile.id && (
             <div className="absolute top-1 right-1 w-3 h-3 bg-black rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
};
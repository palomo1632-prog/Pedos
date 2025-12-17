import { SoundType, SoundProfile } from './types';

export const SOUND_PROFILES: SoundProfile[] = [
  { 
    id: SoundType.PUM, 
    label: '¡PUM!', 
    color: 'bg-yellow-400',
    description: 'IMPACTO SECO',
    // Using a reverb/impact heavy fart for PUM
    url: 'https://www.myinstants.com/media/sounds/fart-with-reverb.mp3'
  },
  { 
    id: SoundType.PRRR, 
    label: '¡PRRR!', 
    color: 'bg-green-400',
    description: 'CLÁSICO ROTO',
    // Classic ripping sound
    url: 'https://www.myinstants.com/media/sounds/fart-1.mp3'
  },
  { 
    id: SoundType.FIUUU, 
    label: '¡FIUUU!', 
    color: 'bg-cyan-400',
    description: 'SILBIDO LETAL',
    // Short squeak
    url: 'https://www.myinstants.com/media/sounds/quick-fart.mp3'
  },
  { 
    id: SoundType.SPLAT, 
    label: '¡SPLAT!', 
    color: 'bg-rose-400',
    description: 'HÚMEDO',
    // Wet sound
    url: 'https://www.myinstants.com/media/sounds/wet-fart_1.mp3'
  },
];

export const MAX_PRESSURE = 100;
export const PRESSURE_RATE = 1.5; 
export const DECAY_RATE = 5; 
export const BASE_PITCH = 0.8; // Lower base pitch for real samples sounds better
export const MAX_PITCH_MULTIPLIER = 1.5; // Less extreme pitch shift for samples
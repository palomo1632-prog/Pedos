export enum SoundType {
  PUM = 'PUM',
  PRRR = 'PRRR',
  FIUUU = 'FIUUU',
  SPLAT = 'SPLAT',
}

export interface SoundProfile {
  id: SoundType;
  label: string;
  color: string;
  description: string;
  url: string; // URL to the audio file
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  vx: number;
  vy: number;
  life: number; // 0 to 1
}
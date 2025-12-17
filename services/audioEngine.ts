import { SoundType, SoundProfile } from '../types';
import { SOUND_PROFILES } from '../constants';

class AudioEngine {
  private context: AudioContext | null = null;
  private buffers: Record<string, AudioBuffer> = {};
  private loaded: boolean = false;

  constructor() {
    // Lazy init
  }

  // Called to start loading files immediately (e.g. during splash screen)
  public async preload(): Promise<void> {
    // Initialize context if possible (might be suspended until gesture)
    if (!this.context) {
       try {
        // @ts-ignore
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContextClass();
      } catch (e) {
        console.error('Web Audio API not supported', e);
        return;
      }
    }

    const loadPromises = SOUND_PROFILES.map(async (profile) => {
      try {
        const response = await fetch(profile.url);
        const arrayBuffer = await response.arrayBuffer();
        if (this.context) {
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.buffers[profile.id] = audioBuffer;
        }
      } catch (error) {
        console.error(`Failed to load sound ${profile.id}:`, error);
      }
    });

    await Promise.all(loadPromises);
    this.loaded = true;
    console.log('All sounds loaded');
  }

  // Called on user interaction (Start button) to resume context
  public async init(): Promise<void> {
    if (!this.context) {
        await this.preload();
    }
    if (this.context?.state === 'suspended') {
      await this.context.resume();
    }
  }

  public play(type: SoundType, playbackRate: number = 1.0) {
    if (!this.context || !this.buffers[type]) return;
    
    const source = this.context.createBufferSource();
    source.buffer = this.buffers[type];
    source.playbackRate.value = playbackRate;

    // Master Compressor/Limiter for loudness without clipping
    const compressor = this.context.createDynamicsCompressor();
    compressor.threshold.value = -10;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;

    source.connect(compressor);
    compressor.connect(this.context.destination);
    
    source.start(0);
  }
}

export const audioEngine = new AudioEngine();
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SoundContextType {
  volume: number;
  isMuted: boolean;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
  playBreakSound: () => void;
  playReflectionSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [breakAudio, setBreakAudio] = useState<HTMLAudioElement | null>(null);
  const [reflectionAudio, setReflectionAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio elements with data URIs for soft ambient tones
    // Break sound: gentle chime (440Hz sine wave)
    const breakSound = new Audio();
    breakSound.src = createSoftChime();
    setBreakAudio(breakSound);

    // Reflection sound: calming bell (528Hz sine wave)
    const reflectionSound = new Audio();
    reflectionSound.src = createCalmingBell();
    setReflectionAudio(reflectionSound);

    return () => {
      breakSound.pause();
      reflectionSound.pause();
    };
  }, []);

  useEffect(() => {
    if (breakAudio) {
      breakAudio.volume = isMuted ? 0 : volume / 100;
    }
    if (reflectionAudio) {
      reflectionAudio.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted, breakAudio, reflectionAudio]);

  const playBreakSound = () => {
    if (breakAudio && !isMuted) {
      breakAudio.currentTime = 0;
      breakAudio.play().catch((e) => console.log('Audio play failed:', e));
    }
  };

  const playReflectionSound = () => {
    if (reflectionAudio && !isMuted) {
      reflectionAudio.currentTime = 0;
      reflectionAudio.play().catch((e) => console.log('Audio play failed:', e));
    }
  };

  return (
    <SoundContext.Provider
      value={{
        volume,
        isMuted,
        setVolume,
        setIsMuted,
        playBreakSound,
        playReflectionSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}

// Generate soft ambient chime sound (440Hz)
function createSoftChime(): string {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const duration = 1.5;
  const numSamples = sampleRate * duration;
  const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-3 * t);
    data[i] = Math.sin(2 * Math.PI * 440 * t) * envelope * 0.3;
  }

  return bufferToWav(buffer);
}

// Generate calming bell sound (528Hz)
function createCalmingBell(): string {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const duration = 2;
  const numSamples = sampleRate * duration;
  const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-2 * t);
    data[i] = Math.sin(2 * Math.PI * 528 * t) * envelope * 0.3;
  }

  return bufferToWav(buffer);
}

// Convert AudioBuffer to WAV data URI
function bufferToWav(buffer: AudioBuffer): string {
  const length = buffer.length * buffer.numberOfChannels * 2 + 44;
  const arrayBuffer = new ArrayBuffer(length);
  const view = new DataView(arrayBuffer);
  const channels: Float32Array[] = [];
  let offset = 0;
  let pos = 0;

  // Write WAV header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(buffer.numberOfChannels);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels); // avg. bytes/sec
  setUint16(buffer.numberOfChannels * 2); // block-align
  setUint16(16); // 16-bit
  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  // Write interleaved data
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      const sample = Math.max(-1, Math.min(1, channels[i][offset]));
      view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      pos += 2;
    }
    offset++;
  }

  const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);

  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}

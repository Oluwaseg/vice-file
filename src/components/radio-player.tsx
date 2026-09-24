'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type StationId = 'vice' | 'mirror' | 'trailer' | 'off';

type AudioBank = {
  ctx: AudioContext;
  masterGain: GainNode;
  intervalId: number | null;
};

const sharedAudioBank: { current: AudioBank | null } = { current: null };
const STATION_KEY = 'vice-files:v1:radio-station';

const stationOptions: Array<{ id: StationId; label: string }> = [
  { id: 'vice', label: 'Vice City Synth' },
  { id: 'mirror', label: 'Radio Mirror Park' },
  { id: 'trailer', label: 'Trailer Theme' },
  { id: 'off', label: 'Mute' },
];

const stationFrequencies: Record<Exclude<StationId, 'off'>, number[]> = {
  vice: [220, 247, 293.66, 329.63, 392, 440],
  mirror: [174.61, 196, 220, 261.63, 293.66, 349.23],
  trailer: [110, 130.81, 164.81, 196, 220, 246.94],
};

function readSavedStation(): StationId {
  if (typeof window === 'undefined') return 'vice';

  try {
    const saved = window.localStorage.getItem(STATION_KEY);
    if (
      saved === 'vice' ||
      saved === 'mirror' ||
      saved === 'trailer' ||
      saved === 'off'
    ) {
      return saved;
    }
  } catch {
    // ignore storage errors and fall back to default
  }

  return 'vice';
}

function triggerTone(
  ctx: AudioContext,
  masterGain: GainNode,
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType
) {
  const now = ctx.currentTime;
  const oscillatorA = ctx.createOscillator();
  const oscillatorB = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillatorA.type = type;
  oscillatorA.frequency.setValueAtTime(frequency, now);
  oscillatorB.type = 'triangle';
  oscillatorB.frequency.setValueAtTime(frequency / 2, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillatorA.connect(gain);
  oscillatorB.connect(gain);
  gain.connect(masterGain);

  oscillatorA.start(now);
  oscillatorB.start(now);
  oscillatorA.stop(now + duration);
  oscillatorB.stop(now + duration);
}

export function RadioPlayer() {
  const [activeStation, setActiveStation] = useState<StationId>('vice');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const audioRef = useRef<AudioBank | null>(sharedAudioBank.current);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = sharedAudioBank.current;
    }
    sharedAudioBank.current = audioRef.current;

    const savedStation = readSavedStation();
    setActiveStation(savedStation);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STATION_KEY, activeStation);
    }
  }, [activeStation]);

  const stopStation = useCallback(() => {
    const bank = audioRef.current;
    if (!bank) return;

    if (bank.intervalId) {
      window.clearInterval(bank.intervalId);
      bank.intervalId = null;
    }

    bank.masterGain.gain.setTargetAtTime(0.0001, bank.ctx.currentTime, 0.2);
  }, []);

  const playStartupAlarm = useCallback(() => {
    const bank = audioRef.current;
    if (!bank) return;

    const { ctx, masterGain } = bank;
    const tones = [196, 246.94, 293.66, 392, 440, 523.25];
    const now = ctx.currentTime;

    tones.forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = index % 2 === 0 ? 'sawtooth' : 'square';
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.1);
      gain.gain.setValueAtTime(0.0001, now + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.11, now + index * 0.1 + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.1 + 0.42);
      oscillator.connect(gain);
      gain.connect(masterGain);
      oscillator.start(now + index * 0.1);
      oscillator.stop(now + index * 0.1 + 0.45);
    });
  }, []);

  const startStation = useCallback(
    (station: StationId) => {
      if (typeof window === 'undefined') return;

      const AudioCtor =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioCtor) return;

      if (!audioRef.current) {
        const ctx = new AudioCtor();
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.0001;
        masterGain.connect(ctx.destination);
        audioRef.current = { ctx, masterGain, intervalId: null };
      }

      const bank = audioRef.current;
      const { ctx, masterGain } = bank;

      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      stopStation();

      if (station === 'off') {
        masterGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2);
        return;
      }

      const frequencies = stationFrequencies[station];
      const pulse = () => {
        const frequency =
          frequencies[Math.floor(Math.random() * frequencies.length)];
        const duration = station === 'trailer' ? 0.85 : 0.65;
        const volume = station === 'trailer' ? 0.045 : 0.032;
        const type = station === 'mirror' ? 'triangle' : 'sawtooth';

        triggerTone(ctx, masterGain, frequency, duration, volume, type);

        if (station === 'trailer') {
          triggerTone(
            ctx,
            masterGain,
            frequency / 2,
            duration,
            volume * 0.7,
            'square'
          );
        }
      };

      masterGain.gain.setTargetAtTime(
        station === 'trailer' ? 0.07 : 0.05,
        ctx.currentTime,
        0.2
      );
      pulse();
      bank.intervalId = window.setInterval(
        pulse,
        station === 'trailer' ? 700 : 550
      );
    },
    [stopStation]
  );

  useEffect(() => {
    if (!isHydrated) return;
    startStation(activeStation);
    return () => stopStation();
  }, [activeStation, startStation, stopStation, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    if (audioRef.current && activeStation !== 'off') {
      playStartupAlarm();
    }
  }, [activeStation, isHydrated, playStartupAlarm]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;

    const handleUserGesture = () => {
      if (audioRef.current && audioRef.current.ctx.state === 'suspended') {
        void audioRef.current.ctx.resume();
      }
      if (!audioRef.current) return;
      playStartupAlarm();
      if (activeStation !== 'off') {
        startStation(activeStation);
      }
    };

    window.addEventListener('pointerdown', handleUserGesture, {
      passive: true,
    });
    window.addEventListener('keydown', handleUserGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
    };
  }, [activeStation, playStartupAlarm, startStation]);

  const stationName =
    activeStation === 'vice'
      ? 'Vice City Synth'
      : activeStation === 'mirror'
        ? 'Radio Mirror Park'
        : activeStation === 'trailer'
          ? 'Trailer Theme'
          : 'Muted';

  return (
    <div
      suppressHydrationWarning
      className={
        isMinimized ? 'radio-widget radio-widget--minimized' : 'radio-widget'
      }
    >
      <div className='radio-widget__header'>
        <span className='radio-widget__label'>Radio</span>
        <span className='radio-widget__status'>
          {activeStation === 'off' ? 'Muted' : 'Live'}
        </span>
        <button
          type='button'
          className='radio-widget__toggle'
          onClick={() => setIsMinimized((value) => !value)}
          disabled={!isHydrated}
          aria-label={
            isMinimized ? 'Expand radio panel' : 'Minimize radio panel'
          }
        >
          {isMinimized ? 'Max' : 'Min'}
        </button>
      </div>

      {!isMinimized ? (
        <fieldset
          className='radio-widget__switcher'
          aria-label='Radio station selector'
          disabled={!isHydrated}
        >
          <legend className='radio-widget__legend'>Stations</legend>
          {stationOptions.map((station) => (
            <button
              key={station.id}
              type='button'
              className={
                activeStation === station.id
                  ? 'radio-widget__button radio-widget__button--active'
                  : 'radio-widget__button'
              }
              onClick={() => setActiveStation(station.id)}
              disabled={!isHydrated}
            >
              {station.label}
            </button>
          ))}
        </fieldset>
      ) : (
        <button
          type='button'
          className='radio-widget__mini'
          onClick={() => setIsMinimized(false)}
          disabled={!isHydrated}
        >
          {stationName}
        </button>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import type { DrawConfig, Participant } from '../types';

interface DrawingScreenProps {
  config: DrawConfig;
  onComplete: (winners: Participant[]) => void;
}

export default function DrawingScreen({ config, onComplete }: DrawingScreenProps) {
  const [displayName, setDisplayName] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [phase, setPhase] = useState<'countdown' | 'spinning' | 'done'>('countdown');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Countdown 3, 2, 1
    let count = 3;
    setCountdown(count);

    const countInterval = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(countInterval);
        startSpinning();
      } else {
        setCountdown(count);
      }
    }, 800);

    return () => {
      clearInterval(countInterval);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startSpinning = () => {
    setPhase('spinning');
    const names = config.participants.map((p) => p.name);

    let speed = 60;
    let elapsed = 0;
    const totalDuration = 3000;

    const spin = () => {
      const randomIndex = Math.floor(Math.random() * names.length);
      setDisplayName(names[randomIndex]);
      elapsed += speed;

      // 점점 느려지기
      if (elapsed < totalDuration * 0.6) {
        speed = 60;
      } else if (elapsed < totalDuration * 0.85) {
        speed = 120;
      } else {
        speed = 220;
      }

      if (elapsed < totalDuration) {
        timeoutRef.current = setTimeout(spin, speed);
      } else {
        // 최종 당첨자 뽑기
        const shuffled = [...config.participants].sort(() => Math.random() - 0.5);
        const winners = shuffled.slice(0, config.winnerCount);
        setDisplayName(winners.map((w) => w.name).join(', '));
        setPhase('done');

        timeoutRef.current = setTimeout(() => {
          onComplete(winners);
        }, 1200);
      }
    };

    timeoutRef.current = setTimeout(spin, speed);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
      {phase === 'countdown' && (
        <>
          <p className="text-gray-500 text-lg font-medium">뽑기 준비중...</p>
          <div
            key={countdown}
            className="text-9xl font-black text-indigo-500 animate-ping-once"
            style={{ animation: 'pop 0.4s ease-out' }}
          >
            {countdown}
          </div>
        </>
      )}

      {(phase === 'spinning' || phase === 'done') && (
        <>
          <p className="text-gray-500 text-base font-medium tracking-wide">
            {phase === 'spinning' ? '두구두구두구...' : '당첨!'}
          </p>
          <div
            className={`text-5xl font-black text-center transition-all duration-300 ${
              phase === 'spinning' ? 'text-indigo-500 scale-110' : 'text-purple-600 scale-125'
            }`}
            style={{ minHeight: '3.5rem' }}
          >
            {displayName}
          </div>
          {phase === 'spinning' && (
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full bg-indigo-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

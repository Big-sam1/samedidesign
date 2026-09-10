import { useEffect, useState } from 'react';

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const START_SECONDS = 2 * 86400 + 15 * 3600 + 45 * 60 + 30;

export function useCountdown(initialSeconds: number = START_SECONDS): Countdown {
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining((prev) => prev <= 1 ? initialSeconds : prev - 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [initialSeconds]);

  return {
    days: Math.floor(remaining / 86400),
    hours: Math.floor(remaining % 86400 / 3600),
    minutes: Math.floor(remaining % 3600 / 60),
    seconds: remaining % 60
  };
}
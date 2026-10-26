import { useEffect, useState } from "react";

interface UseTimerProps {
  initialMs: number;
  isRunning: boolean;
  onTimeout?: () => void;
}

export function useTimer({ initialMs, isRunning, onTimeout }: UseTimerProps) {
  const [remainingMs, setRemainingMs] = useState(initialMs);

  useEffect(() => {
    setRemainingMs(initialMs);
  }, [initialMs]);

  useEffect(() => {
    if (!isRunning || remainingMs <= 0) return;

    const interval = setInterval(() => {
      setRemainingMs((prev) => {
        const next = prev - 100;
        if (next <= 0) {
          onTimeout?.();
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, remainingMs, onTimeout]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    remainingMs,
    formattedTime: formatTime(remainingMs),
    isTimeout: remainingMs === 0,
  };
}

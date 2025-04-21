"use client";
import { useState, useEffect } from "react";

export function useCountdown(initialMinutes: number, storageKey: string) {
  // Retrieve stored time from sessionStorage, if available. If not the timeLeft will be the original reservation time.
  const storedTime = sessionStorage.getItem(storageKey);
  const initialTime = storedTime
    ? parseInt(storedTime, 10)
    : initialMinutes * 60;

  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    // decreases the timeLeft by 1s and updates the session. Stop countdown when reaching 0s.
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          sessionStorage.setItem(storageKey, newTime.toString()); // Save time in sessionStorage
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      sessionStorage.removeItem(storageKey); // Clear storage when time runs out
    }

    return () => clearInterval(timer);
  }, [isActive, timeLeft, storageKey]);

  const start = () => setIsActive(true);

  const reset = () => {
    setIsActive(false);
    setTimeLeft(initialMinutes * 60);
    sessionStorage.setItem(storageKey, (initialMinutes * 60).toString()); // Reset storage
  };
  //format the countdown display, acordinglly to timeLeft
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return {
    timeLeft,
    isActive,
    start,
    reset,
    formattedTime: formatTime(timeLeft),
  };
}

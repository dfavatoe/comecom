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
    } else if (timeLeft > 0 && !isActive) {
      //prevents countdown to stop if the page refreshes
      const storedTime = sessionStorage.getItem(storageKey);
      //only if the key(productId) exists in the session, proceed with countdown
      if (storedTime !== null) {
        setIsActive(true);
      }
    }

    return () => clearInterval(timer);
  }, [isActive, timeLeft, storageKey]);

  const start = () => setIsActive(true);

  const reset = () => {
    setIsActive(false);
    setTimeLeft(initialMinutes * 60);
    // setTimeLeft(0); // option: set the display to zero instead of the initial time
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

export function useCountDownfromExpires(expiresAt: string) {
  //get the formated expiresAt date and transform it in miliseconds.
  const expirationTime = new Date(expiresAt).getTime();

  const [timeLeft, setTimeLeft] = useState(expirationTime - Date.now());

  useEffect(() => {
    // defines the timeLeft every second
    const interval = setInterval(() => {
      setTimeLeft(expirationTime - Date.now());
    }, 1000);

    return () => clearInterval(interval); //clears a timer set with the setInterval().
  }, [expirationTime]);

  const formatTime = (ms: number) => {
    //timeLeft is the argument in miliseconds
    //when the timeLeft is less than 0, totalSeconds will be 0, thanks to Math.max() the display will stop in 00:00:00
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isExpired: timeLeft <= 0, //boolean
  };
}

'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface PomodoroTimerProps {
  initialDuration?: number;
  title?: string;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ initialDuration = 25, title = 'Workout Timer' }) => {
  const [minutes, setMinutes] = useState(initialDuration);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const requestNotificationPermission = useCallback(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const showNotification = (message: string) => {
    if (Notification.permission === 'granted') {
      new Notification(message);
    }
  };

  const resetTimer = useCallback((breakTime = false) => {
    setIsActive(false);
    setIsBreak(breakTime);
    if (breakTime) {
      setMinutes(5);
      setSeconds(0);
    } else {
      setMinutes(initialDuration);
      setSeconds(0);
    }
  }, [initialDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          if (isBreak) {
            showNotification('Break is over! Time to get back to work.');
            resetTimer(false);
            setIsStarted(false); 
          } else {
            showNotification('Workout session finished! Time for a break.');
            resetTimer(true);
            setIsActive(true); // Automatically start the break
          }
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isActive, seconds, minutes, isBreak, resetTimer]);

  useEffect(() => {
    setMinutes(initialDuration);
    setSeconds(0);
    setIsStarted(false);
    setIsActive(false);
  },[initialDuration])


  const toggle = () => {
    if (!isStarted) {
      setIsStarted(true);
    }
    setIsActive(!isActive);
  };
  
  const handleStart = () => {
    setIsStarted(true);
    setIsActive(true);
  };

  const handleReset = () => {
    resetTimer(isBreak)
    if(isBreak){
       setIsActive(true)
    } else {
       setIsStarted(false)
    }
  }


  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>{isBreak ? 'Time for a break!' : 'Focus on your workout.'}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="text-6xl font-bold font-mono tabular-nums mb-4">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="flex gap-2">
            {!isStarted ? (
                 <Button onClick={handleStart} size="lg">
                    <Play className="mr-2" /> Start Workout
                </Button>
            ) : (
                <>
                    <Button onClick={toggle} size="icon">
                        {isActive ? <Pause /> : <Play />}
                    </Button>
                    <Button onClick={handleReset} size="icon" variant="outline">
                        <RotateCcw />
                    </Button>
                </>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

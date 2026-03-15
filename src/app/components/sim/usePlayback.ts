import { useEffect, useMemo, useState } from "react";

export function usePlayback<T>(frames: T[]) {
  const safeFrames = useMemo(() => (frames.length ? frames : ([] as T[])), [frames]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [safeFrames]);

  useEffect(() => {
    if (!isPlaying || currentStep >= safeFrames.length - 1) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCurrentStep((step) => {
        if (step >= safeFrames.length - 1) {
          return step;
        }

        return step + 1;
      });
    }, 1100 - speed * 90);

    return () => window.clearTimeout(timer);
  }, [currentStep, isPlaying, safeFrames.length, speed]);

  useEffect(() => {
    if (currentStep >= safeFrames.length - 1) {
      setIsPlaying(false);
    }
  }, [currentStep, safeFrames.length]);

  return {
    currentStep,
    currentFrame: safeFrames[Math.min(currentStep, Math.max(safeFrames.length - 1, 0))],
    isPlaying,
    speed,
    setSpeed,
    setCurrentStep,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    reset: () => {
      setIsPlaying(false);
      setCurrentStep(0);
    },
    stepForward: () => {
      setIsPlaying(false);
      setCurrentStep((step) => Math.min(step + 1, Math.max(safeFrames.length - 1, 0)));
    },
    stepBack: () => {
      setIsPlaying(false);
      setCurrentStep((step) => Math.max(step - 1, 0));
    },
    isFinished: currentStep >= safeFrames.length - 1,
    totalSteps: safeFrames.length,
  };
}

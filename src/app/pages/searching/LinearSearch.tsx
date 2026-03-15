import { useState, useEffect, useRef } from 'react';
import AlgorithmLayout from '../../components/AlgorithmLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function LinearSearch() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90, 88, 45, 50]);
  const [target, setTarget] = useState<number>(22);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [found, setFound] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [inputArray, setInputArray] = useState('64, 34, 25, 12, 22, 11, 90, 88, 45, 50');
  const [inputTarget, setInputTarget] = useState('22');
  const intervalRef = useRef<number | null>(null);

  const code = `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Found at index i
    }
  }
  return -1; // Not found
}`;

  useEffect(() => {
    if (isPlaying && currentIndex < array.length - 1) {
      intervalRef.current = window.setTimeout(() => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        
        if (array[nextIndex] === target) {
          setFound(true);
          setIsPlaying(false);
        } else if (nextIndex === array.length - 1) {
          setFound(false);
          setIsPlaying(false);
        }
      }, 1000 / speed);
    } else if (isPlaying && currentIndex >= array.length - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isPlaying, currentIndex, array, target, speed]);

  const handlePlay = () => {
    if (currentIndex === -1 || found !== null) {
      setCurrentIndex(0);
      setFound(null);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(-1);
    setFound(null);
  };

  const handleStepForward = () => {
    if (currentIndex < array.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      
      if (array[nextIndex] === target) {
        setFound(true);
      } else if (nextIndex === array.length - 1) {
        setFound(false);
      }
    }
  };

  const handleStepBack = () => {
    if (currentIndex > -1) {
      setCurrentIndex(currentIndex - 1);
      setFound(null);
    }
  };

  const handleUpdateArray = () => {
    const newArray = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    const newTarget = parseInt(inputTarget.trim());
    
    if (newArray.length > 0 && !isNaN(newTarget)) {
      setArray(newArray);
      setTarget(newTarget);
      handleReset();
    }
  };

  return (
    <AlgorithmLayout
      title="Linear Search"
      isPlaying={isPlaying}
      onPlay={handlePlay}
      onPause={handlePause}
      onReset={handleReset}
      onStepForward={handleStepForward}
      onStepBack={handleStepBack}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: 'O(n)', space: 'O(1)' }}
      description="Linear Search sequentially checks each element in the array until it finds the target value or reaches the end."
      code={code}
    >
      <div className="space-y-6">
        {/* Input Controls */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Array (comma-separated)</label>
            <div className="flex gap-2">
              <Input
                value={inputArray}
                onChange={(e) => setInputArray(e.target.value)}
                placeholder="64, 34, 25, 12, 22"
                className="flex-1"
              />
              <Input
                value={inputTarget}
                onChange={(e) => setInputTarget(e.target.value)}
                placeholder="Target"
                className="w-24"
              />
              <Button onClick={handleUpdateArray} variant="outline">Update</Button>
            </div>
          </div>
        </div>

        {/* Status */}
        {found !== null && (
          <div className={`p-4 rounded-lg ${found ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
            <p className={`font-semibold ${found ? 'text-green-800' : 'text-red-800'}`}>
              {found ? `Element ${target} found at index ${currentIndex}!` : `Element ${target} not found in the array.`}
            </p>
          </div>
        )}

        {/* Visualization */}
        <div className="flex flex-wrap gap-2 justify-center items-end min-h-[200px]">
          {array.map((value, index) => {
            let bgColor = 'bg-gray-200';
            if (index === currentIndex && array[index] === target) {
              bgColor = 'bg-green-500';
            } else if (index === currentIndex) {
              bgColor = 'bg-yellow-400';
            } else if (index < currentIndex) {
              bgColor = 'bg-gray-400';
            }

            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`w-16 h-16 ${bgColor} rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    index === currentIndex ? 'scale-110 shadow-lg' : ''
                  }`}
                >
                  {value}
                </div>
                <span className="text-xs text-gray-600">{index}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-6 justify-center pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-sm text-gray-700">Not visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-sm text-gray-700">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-sm text-gray-700">Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Found</span>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm"><span className="font-semibold">Target:</span> {target}</p>
          <p className="text-sm"><span className="font-semibold">Current Index:</span> {currentIndex === -1 ? 'Not started' : currentIndex}</p>
          <p className="text-sm"><span className="font-semibold">Current Value:</span> {currentIndex >= 0 && currentIndex < array.length ? array[currentIndex] : '-'}</p>
        </div>
      </div>
    </AlgorithmLayout>
  );
}

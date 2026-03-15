import { useState, useEffect, useRef } from 'react';
import AlgorithmLayout from '../../components/AlgorithmLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function BinarySearch() {
  const [array, setArray] = useState<number[]>([11, 12, 22, 25, 34, 45, 50, 64, 88, 90]);
  const [target, setTarget] = useState<number>(45);
  const [left, setLeft] = useState<number>(-1);
  const [right, setRight] = useState<number>(-1);
  const [mid, setMid] = useState<number>(-1);
  const [found, setFound] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [inputArray, setInputArray] = useState('11, 12, 22, 25, 34, 45, 50, 64, 88, 90');
  const [inputTarget, setInputTarget] = useState('45');
  const intervalRef = useRef<number | null>(null);

  const code = `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Found
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1; // Not found
}`;

  useEffect(() => {
    if (isPlaying && left <= right && left !== -1) {
      intervalRef.current = window.setTimeout(() => {
        const newMid = Math.floor((left + right) / 2);
        setMid(newMid);
        
        if (array[newMid] === target) {
          setFound(true);
          setIsPlaying(false);
        } else if (array[newMid] < target) {
          setLeft(newMid + 1);
        } else {
          setRight(newMid - 1);
        }
      }, 1000 / speed);
    } else if (isPlaying && left > right) {
      setFound(false);
      setIsPlaying(false);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isPlaying, left, right, array, target, speed]);

  const handlePlay = () => {
    if (left === -1 || found !== null) {
      setLeft(0);
      setRight(array.length - 1);
      setMid(-1);
      setFound(null);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setLeft(-1);
    setRight(-1);
    setMid(-1);
    setFound(null);
  };

  const handleUpdateArray = () => {
    const newArray = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num)).sort((a, b) => a - b);
    const newTarget = parseInt(inputTarget.trim());
    
    if (newArray.length > 0 && !isNaN(newTarget)) {
      setArray(newArray);
      setTarget(newTarget);
      handleReset();
    }
  };

  return (
    <AlgorithmLayout
      title="Binary Search"
      isPlaying={isPlaying}
      onPlay={handlePlay}
      onPause={handlePause}
      onReset={handleReset}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: 'O(log n)', space: 'O(1)' }}
      description="Binary Search efficiently finds an element in a sorted array by repeatedly dividing the search interval in half."
      code={code}
    >
      <div className="space-y-6">
        {/* Input Controls */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sorted Array (comma-separated)</label>
            <div className="flex gap-2">
              <Input
                value={inputArray}
                onChange={(e) => setInputArray(e.target.value)}
                placeholder="11, 12, 22, 25, 34"
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
              {found ? `Element ${target} found at index ${mid}!` : `Element ${target} not found in the array.`}
            </p>
          </div>
        )}

        {/* Visualization */}
        <div className="flex flex-wrap gap-2 justify-center items-end min-h-[200px]">
          {array.map((value, index) => {
            let bgColor = 'bg-gray-200';
            let label = '';
            
            if (index === mid && array[index] === target) {
              bgColor = 'bg-green-500';
              label = 'Found';
            } else if (index === mid) {
              bgColor = 'bg-yellow-400';
              label = 'Mid';
            } else if (index === left) {
              bgColor = 'bg-blue-400';
              label = 'Left';
            } else if (index === right) {
              bgColor = 'bg-purple-400';
              label = 'Right';
            } else if (left !== -1 && (index < left || index > right)) {
              bgColor = 'bg-gray-300 opacity-40';
            }

            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`w-16 h-16 ${bgColor} rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    index === mid || index === left || index === right ? 'scale-110 shadow-lg' : ''
                  }`}
                >
                  {value}
                </div>
                <div className="text-center">
                  <span className="text-xs text-gray-600 block">{index}</span>
                  {label && <span className="text-xs font-semibold text-gray-800">{label}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-6 justify-center pt-4 border-t flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <span className="text-sm text-gray-700">Left</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-sm text-gray-700">Mid</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-400 rounded"></div>
            <span className="text-sm text-gray-700">Right</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Found</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 opacity-40 rounded"></div>
            <span className="text-sm text-gray-700">Eliminated</span>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm"><span className="font-semibold">Target:</span> {target}</p>
          <p className="text-sm"><span className="font-semibold">Left:</span> {left === -1 ? '-' : left}</p>
          <p className="text-sm"><span className="font-semibold">Right:</span> {right === -1 ? '-' : right}</p>
          <p className="text-sm"><span className="font-semibold">Mid:</span> {mid === -1 ? '-' : mid}</p>
          <p className="text-sm"><span className="font-semibold">Mid Value:</span> {mid >= 0 && mid < array.length ? array[mid] : '-'}</p>
        </div>
      </div>
    </AlgorithmLayout>
  );
}

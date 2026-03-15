import { useState, useEffect, useRef } from 'react';
import AlgorithmLayout from '../../components/AlgorithmLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function TernarySearch() {
  const [array, setArray] = useState<number[]>([11, 12, 22, 25, 34, 45, 50, 64, 88, 90]);
  const [target, setTarget] = useState<number>(50);
  const [left, setLeft] = useState<number>(-1);
  const [right, setRight] = useState<number>(-1);
  const [mid1, setMid1] = useState<number>(-1);
  const [mid2, setMid2] = useState<number>(-1);
  const [found, setFound] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [inputArray, setInputArray] = useState('11, 12, 22, 25, 34, 45, 50, 64, 88, 90');
  const [inputTarget, setInputTarget] = useState('50');
  const intervalRef = useRef<number | null>(null);

  const code = `function ternarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    let mid1 = left + Math.floor((right - left) / 3);
    let mid2 = right - Math.floor((right - left) / 3);
    
    if (arr[mid1] === target) return mid1;
    if (arr[mid2] === target) return mid2;
    
    if (target < arr[mid1]) {
      right = mid1 - 1;
    } else if (target > arr[mid2]) {
      left = mid2 + 1;
    } else {
      left = mid1 + 1;
      right = mid2 - 1;
    }
  }
  return -1;
}`;

  useEffect(() => {
    if (isPlaying && left <= right && left !== -1) {
      intervalRef.current = window.setTimeout(() => {
        const newMid1 = left + Math.floor((right - left) / 3);
        const newMid2 = right - Math.floor((right - left) / 3);
        setMid1(newMid1);
        setMid2(newMid2);
        
        if (array[newMid1] === target) {
          setFound(true);
          setIsPlaying(false);
        } else if (array[newMid2] === target) {
          setFound(true);
          setIsPlaying(false);
        } else if (target < array[newMid1]) {
          setRight(newMid1 - 1);
        } else if (target > array[newMid2]) {
          setLeft(newMid2 + 1);
        } else {
          setLeft(newMid1 + 1);
          setRight(newMid2 - 1);
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
      setMid1(-1);
      setMid2(-1);
      setFound(null);
    }
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);

  const handleReset = () => {
    setIsPlaying(false);
    setLeft(-1);
    setRight(-1);
    setMid1(-1);
    setMid2(-1);
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
      title="Ternary Search"
      isPlaying={isPlaying}
      onPlay={handlePlay}
      onPause={handlePause}
      onReset={handleReset}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: 'O(log₃ n)', space: 'O(1)' }}
      description="Ternary Search divides the array into three parts using two midpoints, reducing the search space more efficiently than binary search in some cases."
      code={code}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sorted Array (comma-separated)</label>
            <div className="flex gap-2">
              <Input value={inputArray} onChange={(e) => setInputArray(e.target.value)} placeholder="11, 12, 22, 25, 34" className="flex-1" />
              <Input value={inputTarget} onChange={(e) => setInputTarget(e.target.value)} placeholder="Target" className="w-24" />
              <Button onClick={handleUpdateArray} variant="outline">Update</Button>
            </div>
          </div>
        </div>

        {found !== null && (
          <div className={`p-4 rounded-lg ${found ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
            <p className={`font-semibold ${found ? 'text-green-800' : 'text-red-800'}`}>
              {found ? `Element ${target} found!` : `Element ${target} not found.`}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-center items-end min-h-[200px]">
          {array.map((value, index) => {
            let bgColor = 'bg-gray-200';
            let label = '';
            
            if ((index === mid1 || index === mid2) && array[index] === target) {
              bgColor = 'bg-green-500';
              label = 'Found';
            } else if (index === mid1) {
              bgColor = 'bg-yellow-400';
              label = 'Mid1';
            } else if (index === mid2) {
              bgColor = 'bg-orange-400';
              label = 'Mid2';
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
                <div className={`w-16 h-16 ${bgColor} rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                  index === mid1 || index === mid2 || index === left || index === right ? 'scale-110 shadow-lg' : ''
                }`}>
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

        <div className="flex gap-4 justify-center pt-4 border-t flex-wrap">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400 rounded"></div><span className="text-sm">Mid1</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-400 rounded"></div><span className="text-sm">Mid2</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div><span className="text-sm">Found</span></div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm"><span className="font-semibold">Target:</span> {target}</p>
          <p className="text-sm"><span className="font-semibold">Left:</span> {left === -1 ? '-' : left}</p>
          <p className="text-sm"><span className="font-semibold">Right:</span> {right === -1 ? '-' : right}</p>
          <p className="text-sm"><span className="font-semibold">Mid1:</span> {mid1 === -1 ? '-' : mid1}</p>
          <p className="text-sm"><span className="font-semibold">Mid2:</span> {mid2 === -1 ? '-' : mid2}</p>
        </div>
      </div>
    </AlgorithmLayout>
  );
}

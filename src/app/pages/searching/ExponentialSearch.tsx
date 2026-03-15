import { useState, useEffect, useRef } from 'react';
import AlgorithmLayout from '../../components/AlgorithmLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function ExponentialSearch() {
  const [array, setArray] = useState<number[]>([11, 12, 22, 25, 34, 45, 50, 64, 88, 90]);
  const [target, setTarget] = useState<number>(64);
  const [bound, setBound] = useState<number>(1);
  const [left, setLeft] = useState<number>(-1);
  const [right, setRight] = useState<number>(-1);
  const [mid, setMid] = useState<number>(-1);
  const [phase, setPhase] = useState<'finding-range' | 'binary-search' | 'done'>('finding-range');
  const [found, setFound] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [inputArray, setInputArray] = useState('11, 12, 22, 25, 34, 45, 50, 64, 88, 90');
  const [inputTarget, setInputTarget] = useState('64');
  const intervalRef = useRef<number | null>(null);

  const code = `function exponentialSearch(arr, target) {
  if (arr[0] === target) return 0;
  
  // Find range for binary search
  let i = 1;
  while (i < arr.length && arr[i] <= target) {
    i = i * 2;
  }
  
  // Binary search in found range
  return binarySearch(arr, target, 
    i / 2, Math.min(i, arr.length - 1));
}`;

  useEffect(() => {
    if (isPlaying && found === null) {
      intervalRef.current = window.setTimeout(() => {
        if (phase === 'finding-range') {
          if (bound < array.length && array[bound] < target) {
            setBound(bound * 2);
          } else {
            // Switch to binary search
            setPhase('binary-search');
            setLeft(Math.floor(bound / 2));
            setRight(Math.min(bound, array.length - 1));
          }
        } else if (phase === 'binary-search' && left <= right) {
          const newMid = Math.floor((left + right) / 2);
          setMid(newMid);
          
          if (array[newMid] === target) {
            setFound(true);
            setPhase('done');
            setIsPlaying(false);
          } else if (array[newMid] < target) {
            setLeft(newMid + 1);
          } else {
            setRight(newMid - 1);
          }
        } else if (phase === 'binary-search' && left > right) {
          setFound(false);
          setPhase('done');
          setIsPlaying(false);
        }
      }, 1000 / speed);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isPlaying, phase, bound, left, right, array, target, speed]);

  const handlePlay = () => {
    if (found !== null) {
      setBound(1);
      setLeft(-1);
      setRight(-1);
      setMid(-1);
      setPhase('finding-range');
      setFound(null);
    }
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);

  const handleReset = () => {
    setIsPlaying(false);
    setBound(1);
    setLeft(-1);
    setRight(-1);
    setMid(-1);
    setPhase('finding-range');
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
      title="Exponential Search"
      isPlaying={isPlaying}
      onPlay={handlePlay}
      onPause={handlePause}
      onReset={handleReset}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: 'O(log n)', space: 'O(1)' }}
      description="Exponential Search finds the range where the element is present by doubling the index, then performs binary search in that range."
      code={code}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sorted Array (comma-separated)</label>
            <div className="flex gap-2">
              <Input value={inputArray} onChange={(e) => setInputArray(e.target.value)} className="flex-1" />
              <Input value={inputTarget} onChange={(e) => setInputTarget(e.target.value)} placeholder="Target" className="w-24" />
              <Button onClick={handleUpdateArray} variant="outline">Update</Button>
            </div>
          </div>
        </div>

        {found !== null && (
          <div className={`p-4 rounded-lg ${found ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
            <p className={`font-semibold ${found ? 'text-green-800' : 'text-red-800'}`}>
              {found ? `Element ${target} found at index ${mid}!` : `Element ${target} not found.`}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-center items-end min-h-[200px]">
          {array.map((value, index) => {
            let bgColor = 'bg-gray-200';
            let label = '';
            
            if (phase === 'finding-range') {
              if (index === bound) {
                bgColor = 'bg-yellow-400';
                label = 'Bound';
              } else if (index < bound) {
                bgColor = 'bg-blue-200';
              }
            } else if (phase === 'binary-search' || phase === 'done') {
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
            }

            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className={`w-14 h-14 ${bgColor} rounded-lg flex items-center justify-center font-bold transition-all duration-300 ${
                  index === bound || index === mid ? 'scale-110 shadow-lg' : ''
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
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400 rounded"></div><span className="text-sm">Bound/Mid</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-200 rounded"></div><span className="text-sm">Range Found</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div><span className="text-sm">Found</span></div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm"><span className="font-semibold">Target:</span> {target}</p>
          <p className="text-sm"><span className="font-semibold">Phase:</span> {phase === 'finding-range' ? 'Finding Range' : phase === 'binary-search' ? 'Binary Search' : 'Done'}</p>
          <p className="text-sm"><span className="font-semibold">Bound:</span> {bound}</p>
          {phase !== 'finding-range' && (
            <>
              <p className="text-sm"><span className="font-semibold">Left:</span> {left}</p>
              <p className="text-sm"><span className="font-semibold">Right:</span> {right}</p>
              <p className="text-sm"><span className="font-semibold">Mid:</span> {mid === -1 ? '-' : mid}</p>
            </>
          )}
        </div>
      </div>
    </AlgorithmLayout>
  );
}

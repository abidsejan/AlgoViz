import { useState, useEffect, useRef } from 'react';
import AlgorithmLayout from '../../components/AlgorithmLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

interface JumpSearchProps {
  title?: string;
  description?: string;
}

export default function JumpSearch({
  title = "Jump Search",
  description = "Jump Search works on sorted arrays by jumping ahead by fixed steps (√n), then doing linear search in the identified block.",
}: JumpSearchProps) {
  const [array, setArray] = useState<number[]>([11, 12, 22, 25, 34, 45, 50, 64, 88, 90, 100, 110]);
  const [target, setTarget] = useState<number>(64);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [blockSize, setBlockSize] = useState<number>(0);
  const [prevIndex, setPrevIndex] = useState<number>(0);
  const [linearSearching, setLinearSearching] = useState(false);
  const [found, setFound] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [inputArray, setInputArray] = useState('11, 12, 22, 25, 34, 45, 50, 64, 88, 90, 100, 110');
  const [inputTarget, setInputTarget] = useState('64');
  const intervalRef = useRef<number | null>(null);

  const code = `function jumpSearch(arr, target) {
  let n = arr.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;
  
  // Jump to find block
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  
  // Linear search in block
  while (arr[prev] < target) {
    prev++;
    if (prev == Math.min(step, n))
      return -1;
  }
  
  if (arr[prev] == target) return prev;
  return -1;
}`;

  useEffect(() => {
    if (blockSize === 0 && array.length > 0) {
      setBlockSize(Math.floor(Math.sqrt(array.length)));
    }
  }, [array, blockSize]);

  useEffect(() => {
    if (isPlaying && found === null) {
      intervalRef.current = window.setTimeout(() => {
        if (!linearSearching) {
          // Jumping phase
          if (currentIndex < array.length && array[currentIndex] < target) {
            setPrevIndex(currentIndex);
            setCurrentIndex(Math.min(currentIndex + blockSize, array.length - 1));
          } else {
            // Start linear search
            setLinearSearching(true);
            setCurrentIndex(prevIndex);
          }
        } else {
          // Linear search phase
          if (array[currentIndex] === target) {
            setFound(true);
            setIsPlaying(false);
          } else if (currentIndex >= Math.min(prevIndex + blockSize, array.length - 1)) {
            setFound(false);
            setIsPlaying(false);
          } else {
            setCurrentIndex(currentIndex + 1);
          }
        }
      }, 1000 / speed);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isPlaying, currentIndex, linearSearching, array, target, speed, blockSize, prevIndex]);

  const handlePlay = () => {
    if (found !== null) {
      setCurrentIndex(0);
      setPrevIndex(0);
      setLinearSearching(false);
      setFound(null);
    }
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setPrevIndex(0);
    setLinearSearching(false);
    setFound(null);
  };

  const handleUpdateArray = () => {
    const newArray = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num)).sort((a, b) => a - b);
    const newTarget = parseInt(inputTarget.trim());
    
    if (newArray.length > 0 && !isNaN(newTarget)) {
      setArray(newArray);
      setTarget(newTarget);
      setBlockSize(Math.floor(Math.sqrt(newArray.length)));
      handleReset();
    }
  };

  return (
    <AlgorithmLayout
      title={title}
      isPlaying={isPlaying}
      onPlay={handlePlay}
      onPause={handlePause}
      onReset={handleReset}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: 'O(√n)', space: 'O(1)' }}
      description={description}
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
              {found ? `Element ${target} found at index ${currentIndex}!` : `Element ${target} not found.`}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-center items-end min-h-[200px]">
          {array.map((value, index) => {
            let bgColor = 'bg-gray-200';
            
            if (index === currentIndex && array[index] === target) {
              bgColor = 'bg-green-500';
            } else if (index === currentIndex) {
              bgColor = linearSearching ? 'bg-orange-400' : 'bg-yellow-400';
            } else if (index === prevIndex && !linearSearching) {
              bgColor = 'bg-blue-400';
            } else if (linearSearching && index >= prevIndex && index < currentIndex) {
              bgColor = 'bg-gray-400';
            }

            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className={`w-14 h-14 ${bgColor} rounded-lg flex items-center justify-center font-bold transition-all duration-300 ${
                  index === currentIndex ? 'scale-110 shadow-lg' : ''
                }`}>
                  {value}
                </div>
                <span className="text-xs text-gray-600">{index}</span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 justify-center pt-4 border-t flex-wrap">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400 rounded"></div><span className="text-sm">Jumping</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-400 rounded"></div><span className="text-sm">Linear Search</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div><span className="text-sm">Found</span></div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm"><span className="font-semibold">Target:</span> {target}</p>
          <p className="text-sm"><span className="font-semibold">Block Size:</span> {blockSize}</p>
          <p className="text-sm"><span className="font-semibold">Phase:</span> {linearSearching ? 'Linear Search' : 'Jumping'}</p>
          <p className="text-sm"><span className="font-semibold">Current Index:</span> {currentIndex}</p>
        </div>
      </div>
    </AlgorithmLayout>
  );
}

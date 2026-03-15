import { useState, useEffect, useRef } from 'react';
import AlgorithmLayout from '../../components/AlgorithmLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function HeapSort() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [sortedArray, setSortedArray] = useState<number[]>([...array]);
  const [heapSize, setHeapSize] = useState<number>(array.length);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [sorted, setSorted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [inputArray, setInputArray] = useState('64, 34, 25, 12, 22, 11, 90');
  const [phase, setPhase] = useState<'building' | 'sorting'>('building');
  const intervalRef = useRef<number | null>(null);

  const code = `function heapSort(arr) {
  let n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
}

function heapify(arr, n, i) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest])
    largest = left;
  if (right < n && arr[right] > arr[largest])
    largest = right;
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`;

  const heapify = (arr: number[], n: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(arr, n, largest);
    }
  };

  useEffect(() => {
    if (isPlaying && !sorted) {
      intervalRef.current = window.setTimeout(() => {
        const newArray = [...sortedArray];
        
        if (phase === 'building' && currentIndex === -1) {
          setCurrentIndex(Math.floor(newArray.length / 2) - 1);
        } else if (phase === 'building' && currentIndex >= 0) {
          heapify(newArray, newArray.length, currentIndex);
          setSortedArray(newArray);
          
          if (currentIndex === 0) {
            setPhase('sorting');
            setCurrentIndex(newArray.length - 1);
            setHeapSize(newArray.length - 1);
          } else {
            setCurrentIndex(currentIndex - 1);
          }
        } else if (phase === 'sorting' && currentIndex > 0) {
          [newArray[0], newArray[currentIndex]] = [newArray[currentIndex], newArray[0]];
          heapify(newArray, currentIndex, 0);
          setSortedArray(newArray);
          setCurrentIndex(currentIndex - 1);
          setHeapSize(currentIndex);
        } else {
          setSorted(true);
          setIsPlaying(false);
        }
      }, 1000 / speed);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isPlaying, currentIndex, phase, sortedArray, sorted, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  const handleReset = () => {
    setIsPlaying(false);
    setSortedArray([...array]);
    setCurrentIndex(-1);
    setHeapSize(array.length);
    setPhase('building');
    setSorted(false);
  };

  const handleUpdateArray = () => {
    const newArray = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    if (newArray.length > 0) {
      setArray(newArray);
      setSortedArray([...newArray]);
      setCurrentIndex(-1);
      setHeapSize(newArray.length);
      setPhase('building');
      setSorted(false);
      setIsPlaying(false);
    }
  };

  return (
    <AlgorithmLayout
      title="Heap Sort"
      isPlaying={isPlaying}
      onPlay={handlePlay}
      onPause={handlePause}
      onReset={handleReset}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: 'O(n log n)', space: 'O(1)' }}
      description="Heap Sort builds a max heap from the array, then repeatedly extracts the maximum element and rebuilds the heap."
      code={code}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Array (comma-separated)</label>
            <div className="flex gap-2">
              <Input value={inputArray} onChange={(e) => setInputArray(e.target.value)} className="flex-1" />
              <Button onClick={handleUpdateArray} variant="outline">Update</Button>
            </div>
          </div>
        </div>

        {sorted && (
          <div className="p-4 rounded-lg bg-green-100 border border-green-300">
            <p className="font-semibold text-green-800">Array sorted successfully!</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-center items-end min-h-[300px]">
          {sortedArray.map((value, index) => {
            let bgColor = 'bg-gray-200';
            
            if (sorted || index >= heapSize) {
              bgColor = 'bg-green-500';
            } else if (index === 0 && phase === 'sorting') {
              bgColor = 'bg-purple-500';
            } else if (index === currentIndex) {
              bgColor = 'bg-yellow-400';
            } else if (index < heapSize) {
              bgColor = 'bg-blue-200';
            }

            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  style={{ height: `${value * 3}px` }}
                  className={`w-12 ${bgColor} rounded-t-lg flex items-end justify-center pb-1 font-semibold text-sm transition-all duration-300 ${
                    index === currentIndex ? 'scale-110 shadow-lg' : ''
                  }`}
                >
                  {value}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 justify-center pt-4 border-t flex-wrap">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-200 rounded"></div><span className="text-sm">Heap</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-purple-500 rounded"></div><span className="text-sm">Root</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400 rounded"></div><span className="text-sm">Current</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div><span className="text-sm">Sorted</span></div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm"><span className="font-semibold">Phase:</span> {phase === 'building' ? 'Building Heap' : 'Extracting & Sorting'}</p>
          <p className="text-sm"><span className="font-semibold">Heap Size:</span> {heapSize}</p>
          <p className="text-sm"><span className="font-semibold">Current Index:</span> {currentIndex}</p>
        </div>
      </div>
    </AlgorithmLayout>
  );
}

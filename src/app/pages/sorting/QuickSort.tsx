import { useState, useEffect, useRef } from 'react';
import AlgorithmLayout from '../../components/AlgorithmLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function QuickSort() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [sortedArray, setSortedArray] = useState<number[]>([...array]);
  const [pivot, setPivot] = useState<number>(-1);
  const [left, setLeft] = useState<number>(-1);
  const [right, setRight] = useState<number>(-1);
  const [sorted, setSorted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [inputArray, setInputArray] = useState('64, 34, 25, 12, 22, 11, 90');
  const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set());
  const intervalRef = useRef<number | null>(null);

  const code = `function quickSort(arr, low, high) {
  if (low < high) {
    let pi = partition(arr, low, high);
    
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`;

  useEffect(() => {
    if (isPlaying && !sorted) {
      intervalRef.current = window.setTimeout(() => {
        // Simple visualization of partition step
        if (left === -1) {
          setLeft(0);
          setRight(sortedArray.length - 1);
          setPivot(sortedArray.length - 1);
        } else if (left < right) {
          const newArray = [...sortedArray];
          const pivotValue = newArray[pivot];
          let i = left - 1;
          
          for (let j = left; j < right; j++) {
            if (newArray[j] < pivotValue) {
              i++;
              [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
          }
          [newArray[i + 1], newArray[right]] = [newArray[right], newArray[i + 1]];
          
          setSortedArray(newArray);
          setSortedIndices(prev => new Set([...prev, i + 1]));
          
          if (i + 1 >= sortedArray.length - 1) {
            setSorted(true);
            setIsPlaying(false);
          } else {
            setLeft(i + 2);
            setPivot(right);
          }
        } else {
          setSorted(true);
          setIsPlaying(false);
        }
      }, 1000 / speed);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isPlaying, left, right, pivot, sortedArray, sorted, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  const handleReset = () => {
    setIsPlaying(false);
    setSortedArray([...array]);
    setPivot(-1);
    setLeft(-1);
    setRight(-1);
    setSorted(false);
    setSortedIndices(new Set());
  };

  const handleUpdateArray = () => {
    const newArray = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    if (newArray.length > 0) {
      setArray(newArray);
      setSortedArray([...newArray]);
      setPivot(-1);
      setLeft(-1);
      setRight(-1);
      setSorted(false);
      setSortedIndices(new Set());
      setIsPlaying(false);
    }
  };

  return (
    <AlgorithmLayout
      title="Quick Sort"
      isPlaying={isPlaying}
      onPlay={handlePlay}
      onPause={handlePause}
      onReset={handleReset}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: 'O(n log n) avg, O(n²) worst', space: 'O(log n)' }}
      description="Quick Sort picks a pivot element and partitions the array around it, placing smaller elements before and larger elements after the pivot."
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
            
            if (sorted) {
              bgColor = 'bg-green-500';
            } else if (index === pivot) {
              bgColor = 'bg-purple-500';
            } else if (sortedIndices.has(index)) {
              bgColor = 'bg-green-300';
            } else if (left !== -1 && right !== -1 && index >= left && index <= right) {
              bgColor = 'bg-yellow-200';
            }

            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  style={{ height: `${value * 3}px` }}
                  className={`w-12 ${bgColor} rounded-t-lg flex items-end justify-center pb-1 font-semibold text-sm transition-all duration-300 ${
                    index === pivot ? 'scale-110 shadow-lg' : ''
                  }`}
                >
                  {value}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 justify-center pt-4 border-t flex-wrap">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-purple-500 rounded"></div><span className="text-sm">Pivot</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-200 rounded"></div><span className="text-sm">Partitioning</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-300 rounded"></div><span className="text-sm">Placed</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div><span className="text-sm">Sorted</span></div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm"><span className="font-semibold">Pivot Index:</span> {pivot === -1 ? '-' : pivot}</p>
          <p className="text-sm"><span className="font-semibold">Pivot Value:</span> {pivot >= 0 && pivot < sortedArray.length ? sortedArray[pivot] : '-'}</p>
        </div>
      </div>
    </AlgorithmLayout>
  );
}

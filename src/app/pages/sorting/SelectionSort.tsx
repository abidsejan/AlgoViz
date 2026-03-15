import { useState, useEffect, useRef } from 'react';
import AlgorithmLayout from '../../components/AlgorithmLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function SelectionSort() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [sortedArray, setSortedArray] = useState<number[]>([...array]);
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [minIndex, setMinIndex] = useState(0);
  const [sorted, setSorted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [inputArray, setInputArray] = useState('64, 34, 25, 12, 22, 11, 90');
  const intervalRef = useRef<number | null>(null);

  const code = `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}`;

  useEffect(() => {
    if (isPlaying && !sorted) {
      intervalRef.current = window.setTimeout(() => {
        const newArray = [...sortedArray];
        
        if (i < newArray.length - 1) {
          if (j === 0) {
            setMinIndex(i);
            setJ(i + 1);
          } else if (j < newArray.length) {
            if (newArray[j] < newArray[minIndex]) {
              setMinIndex(j);
            }
            setJ(j + 1);
          } else {
            // Swap
            if (minIndex !== i) {
              [newArray[i], newArray[minIndex]] = [newArray[minIndex], newArray[i]];
              setSortedArray(newArray);
            }
            setI(i + 1);
            setJ(0);
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
  }, [isPlaying, i, j, minIndex, sortedArray, sorted, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  const handleReset = () => {
    setIsPlaying(false);
    setSortedArray([...array]);
    setI(0);
    setJ(0);
    setMinIndex(0);
    setSorted(false);
  };

  const handleUpdateArray = () => {
    const newArray = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    if (newArray.length > 0) {
      setArray(newArray);
      setSortedArray([...newArray]);
      setI(0);
      setJ(0);
      setMinIndex(0);
      setSorted(false);
      setIsPlaying(false);
    }
  };

  return (
    <AlgorithmLayout
      title="Selection Sort"
      isPlaying={isPlaying}
      onPlay={handlePlay}
      onPause={handlePause}
      onReset={handleReset}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: 'O(n²)', space: 'O(1)' }}
      description="Selection Sort divides the array into sorted and unsorted parts, repeatedly selecting the minimum element from the unsorted part."
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
            
            if (sorted || index < i) {
              bgColor = 'bg-green-500';
            } else if (index === minIndex && j > 0) {
              bgColor = 'bg-red-400';
            } else if (index === j) {
              bgColor = 'bg-yellow-400';
            } else if (index === i) {
              bgColor = 'bg-blue-400';
            }

            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  style={{ height: `${value * 3}px` }}
                  className={`w-12 ${bgColor} rounded-t-lg flex items-end justify-center pb-1 font-semibold text-sm transition-all duration-300 ${
                    index === j || index === minIndex ? 'scale-110 shadow-lg' : ''
                  }`}
                >
                  {value}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 justify-center pt-4 border-t flex-wrap">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div><span className="text-sm">Sorted</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-400 rounded"></div><span className="text-sm">Current Position</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-400 rounded"></div><span className="text-sm">Min</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400 rounded"></div><span className="text-sm">Comparing</span></div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm"><span className="font-semibold">Current Position (i):</span> {i}</p>
          <p className="text-sm"><span className="font-semibold">Comparing (j):</span> {j}</p>
          <p className="text-sm"><span className="font-semibold">Min Index:</span> {minIndex}</p>
          <p className="text-sm"><span className="font-semibold">Min Value:</span> {minIndex < sortedArray.length ? sortedArray[minIndex] : '-'}</p>
        </div>
      </div>
    </AlgorithmLayout>
  );
}

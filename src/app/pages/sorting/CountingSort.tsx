import { useState, useEffect, useRef } from 'react';
import AlgorithmLayout from '../../components/AlgorithmLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function CountingSort() {
  const [array, setArray] = useState<number[]>([4, 2, 2, 8, 3, 3, 1]);
  const [sortedArray, setSortedArray] = useState<number[]>([...array]);
  const [countArray, setCountArray] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [phase, setPhase] = useState<'counting' | 'placing' | 'done'>('counting');
  const [sorted, setSorted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [inputArray, setInputArray] = useState('4, 2, 2, 8, 3, 3, 1');
  const intervalRef = useRef<number | null>(null);

  const code = `function countingSort(arr) {
  let max = Math.max(...arr);
  let count = new Array(max + 1).fill(0);
  let output = new Array(arr.length);
  
  // Count occurrences
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
  }
  
  // Cumulative count
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }
  
  // Build output array
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
  }
  
  return output;
}`;

  useEffect(() => {
    if (isPlaying && !sorted) {
      intervalRef.current = window.setTimeout(() => {
        if (phase === 'counting') {
          if (countArray.length === 0) {
            const max = Math.max(...array);
            const newCountArray = new Array(max + 1).fill(0);
            array.forEach(num => newCountArray[num]++);
            setCountArray(newCountArray);
            setCurrentIndex(0);
          } else {
            setPhase('placing');
            setCurrentIndex(0);
          }
        } else if (phase === 'placing') {
          const result: number[] = [];
          countArray.forEach((count, value) => {
            for (let i = 0; i < count; i++) {
              result.push(value);
            }
          });
          
          setSortedArray(result);
          setSorted(true);
          setPhase('done');
          setIsPlaying(false);
        }
      }, 1000 / speed);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isPlaying, phase, array, countArray, sorted, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  const handleReset = () => {
    setIsPlaying(false);
    setSortedArray([...array]);
    setCountArray([]);
    setCurrentIndex(-1);
    setPhase('counting');
    setSorted(false);
  };

  const handleUpdateArray = () => {
    const newArray = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num) && num >= 0);
    if (newArray.length > 0) {
      setArray(newArray);
      setSortedArray([...newArray]);
      setCountArray([]);
      setCurrentIndex(-1);
      setPhase('counting');
      setSorted(false);
      setIsPlaying(false);
    }
  };

  return (
    <AlgorithmLayout
      title="Counting Sort"
      isPlaying={isPlaying}
      onPlay={handlePlay}
      onPause={handlePause}
      onReset={handleReset}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: 'O(n + k)', space: 'O(k)' }}
      description="Counting Sort counts the occurrences of each element and uses arithmetic to determine positions. Works best with small range integers."
      code={code}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Array (non-negative integers, comma-separated)</label>
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

        {/* Count Array Visualization */}
        {countArray.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Count Array:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {countArray.map((count, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center font-bold text-lg">
                    {count}
                  </div>
                  <span className="text-xs text-gray-600">val: {index}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sorted Array Visualization */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">{sorted ? 'Sorted Array:' : 'Original Array:'}</h3>
          <div className="flex flex-wrap gap-2 justify-center items-end min-h-[200px]">
            {sortedArray.map((value, index) => {
              const bgColor = sorted ? 'bg-green-500' : 'bg-gray-300';

              return (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    style={{ height: `${value * 20}px` }}
                    className={`w-12 ${bgColor} rounded-t-lg flex items-end justify-center pb-1 font-semibold text-sm transition-all duration-300`}
                  >
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 justify-center pt-4 border-t flex-wrap">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-400 rounded"></div><span className="text-sm">Count</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div><span className="text-sm">Sorted</span></div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm"><span className="font-semibold">Phase:</span> {phase === 'counting' ? 'Counting Elements' : phase === 'placing' ? 'Placing Elements' : 'Done'}</p>
          <p className="text-sm"><span className="font-semibold">Array Length:</span> {array.length}</p>
          <p className="text-sm"><span className="font-semibold">Max Value:</span> {array.length > 0 ? Math.max(...array) : 0}</p>
        </div>
      </div>
    </AlgorithmLayout>
  );
}

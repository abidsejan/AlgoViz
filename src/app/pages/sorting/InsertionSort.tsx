import { useState, useEffect, useRef } from 'react';
import AlgorithmLayout from '../../components/AlgorithmLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function InsertionSort() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [sortedArray, setSortedArray] = useState<number[]>([...array]);
  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const [comparingIndex, setComparingIndex] = useState<number>(-1);
  const [sorted, setSorted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [inputArray, setInputArray] = useState('64, 34, 25, 12, 22, 11, 90');
  const intervalRef = useRef<number | null>(null);

  const code = `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`;

  useEffect(() => {
    if (isPlaying && !sorted) {
      intervalRef.current = window.setTimeout(() => {
        const newArray = [...sortedArray];
        
        if (currentIndex < newArray.length) {
          let j = currentIndex - 1;
          const key = newArray[currentIndex];
          
          if (comparingIndex === -1) {
            setComparingIndex(j);
          } else {
            if (comparingIndex >= 0 && newArray[comparingIndex] > key) {
              newArray[comparingIndex + 1] = newArray[comparingIndex];
              setComparingIndex(comparingIndex - 1);
              setSortedArray(newArray);
            } else {
              newArray[comparingIndex + 1] = key;
              setSortedArray(newArray);
              setCurrentIndex(currentIndex + 1);
              setComparingIndex(-1);
            }
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
  }, [isPlaying, currentIndex, comparingIndex, sortedArray, sorted, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  const handleReset = () => {
    setIsPlaying(false);
    setSortedArray([...array]);
    setCurrentIndex(1);
    setComparingIndex(-1);
    setSorted(false);
  };

  const handleUpdateArray = () => {
    const newArray = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    if (newArray.length > 0) {
      setArray(newArray);
      setSortedArray([...newArray]);
      setCurrentIndex(1);
      setComparingIndex(-1);
      setSorted(false);
      setIsPlaying(false);
    }
  };

  return (
    <AlgorithmLayout
      title="Insertion Sort"
      isPlaying={isPlaying}
      onPlay={handlePlay}
      onPause={handlePause}
      onReset={handleReset}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: 'O(n²)', space: 'O(1)' }}
      description="Insertion Sort builds the final sorted array one item at a time by inserting each element into its correct position."
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
            } else if (index < currentIndex && index !== comparingIndex) {
              bgColor = 'bg-green-300';
            } else if (index === currentIndex) {
              bgColor = 'bg-yellow-400';
            } else if (index === comparingIndex) {
              bgColor = 'bg-orange-400';
            }

            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  style={{ height: `${value * 3}px` }}
                  className={`w-12 ${bgColor} rounded-t-lg flex items-end justify-center pb-1 font-semibold text-sm transition-all duration-300 ${
                    index === currentIndex || index === comparingIndex ? 'scale-110 shadow-lg' : ''
                  }`}
                >
                  {value}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 justify-center pt-4 border-t flex-wrap">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-300 rounded"></div><span className="text-sm">Sorted</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400 rounded"></div><span className="text-sm">Current</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-400 rounded"></div><span className="text-sm">Comparing</span></div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm"><span className="font-semibold">Current Index:</span> {currentIndex}</p>
          <p className="text-sm"><span className="font-semibold">Comparing Index:</span> {comparingIndex === -1 ? '-' : comparingIndex}</p>
        </div>
      </div>
    </AlgorithmLayout>
  );
}

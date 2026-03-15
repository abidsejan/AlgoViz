import { useState, useEffect, useRef } from 'react';
import AlgorithmLayout from '../../components/AlgorithmLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

interface MergeStep {
  array: number[];
  left: number;
  right: number;
  mid?: number;
  merging?: boolean;
}

export default function MergeSort() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [sortedArray, setSortedArray] = useState<number[]>([...array]);
  const [steps, setSteps] = useState<MergeStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [sorted, setSorted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [inputArray, setInputArray] = useState('64, 34, 25, 12, 22, 11, 90');
  const intervalRef = useRef<number | null>(null);

  const code = `function mergeSort(arr, l, r) {
  if (l < r) {
    let m = Math.floor((l + r) / 2);
    
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
  }
}

function merge(arr, l, m, r) {
  let left = arr.slice(l, m + 1);
  let right = arr.slice(m + 1, r + 1);
  
  let i = 0, j = 0, k = l;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      arr[k++] = left[i++];
    } else {
      arr[k++] = right[j++];
    }
  }
  
  while (i < left.length) arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
}`;

  const generateMergeSortSteps = (arr: number[]) => {
    const steps: MergeStep[] = [];
    const workArray = [...arr];

    const mergeSortHelper = (arr: number[], left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        steps.push({ array: [...arr], left, right, mid });
        
        mergeSortHelper(arr, left, mid);
        mergeSortHelper(arr, mid + 1, right);
        
        merge(arr, left, mid, right);
        steps.push({ array: [...arr], left, right, mid, merging: true });
      }
    };

    const merge = (arr: number[], left: number, mid: number, right: number) => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;
      while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
          arr[k++] = leftArr[i++];
        } else {
          arr[k++] = rightArr[j++];
        }
      }
      
      while (i < leftArr.length) arr[k++] = leftArr[i++];
      while (j < rightArr.length) arr[k++] = rightArr[j++];
    };

    mergeSortHelper(workArray, 0, workArray.length - 1);
    return steps;
  };

  useEffect(() => {
    if (steps.length === 0 && array.length > 0) {
      const newSteps = generateMergeSortSteps(array);
      setSteps(newSteps);
    }
  }, [array, steps.length]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      intervalRef.current = window.setTimeout(() => {
        setSortedArray(steps[currentStep].array);
        setCurrentStep(currentStep + 1);
        
        if (currentStep + 1 >= steps.length) {
          setSorted(true);
          setIsPlaying(false);
        }
      }, 1000 / speed);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isPlaying, currentStep, steps, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  const handleReset = () => {
    setIsPlaying(false);
    setSortedArray([...array]);
    setCurrentStep(0);
    setSorted(false);
  };

  const handleUpdateArray = () => {
    const newArray = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    if (newArray.length > 0) {
      setArray(newArray);
      setSortedArray([...newArray]);
      setSteps(generateMergeSortSteps(newArray));
      setCurrentStep(0);
      setSorted(false);
      setIsPlaying(false);
    }
  };

  const currentStepData = steps[currentStep] || { array: sortedArray, left: -1, right: -1 };

  return (
    <AlgorithmLayout
      title="Merge Sort"
      isPlaying={isPlaying}
      onPlay={handlePlay}
      onPause={handlePause}
      onReset={handleReset}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: 'O(n log n)', space: 'O(n)' }}
      description="Merge Sort is a divide-and-conquer algorithm that divides the array into halves, sorts them, and then merges them back together."
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
            } else if (index >= currentStepData.left && index <= currentStepData.right) {
              bgColor = currentStepData.merging ? 'bg-blue-400' : 'bg-yellow-400';
            }

            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  style={{ height: `${value * 3}px` }}
                  className={`w-12 ${bgColor} rounded-t-lg flex items-end justify-center pb-1 font-semibold text-sm transition-all duration-300`}
                >
                  {value}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 justify-center pt-4 border-t flex-wrap">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400 rounded"></div><span className="text-sm">Dividing</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-400 rounded"></div><span className="text-sm">Merging</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div><span className="text-sm">Sorted</span></div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm"><span className="font-semibold">Step:</span> {currentStep} / {steps.length}</p>
          <p className="text-sm"><span className="font-semibold">Phase:</span> {currentStepData.merging ? 'Merging' : 'Dividing'}</p>
        </div>
      </div>
    </AlgorithmLayout>
  );
}

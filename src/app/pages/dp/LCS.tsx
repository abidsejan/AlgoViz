import { useState, useEffect, useRef } from 'react';
import AlgorithmLayout from '../../components/AlgorithmLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function LCS() {
  const [str1, setStr1] = useState('ABCDGH');
  const [str2, setStr2] = useState('AEDFHR');
  const [inputStr1, setInputStr1] = useState('ABCDGH');
  const [inputStr2, setInputStr2] = useState('AEDFHR');
  const [dp, setDp] = useState<number[][]>([]);
  const [currentI, setCurrentI] = useState(0);
  const [currentJ, setCurrentJ] = useState(0);
  const [lcs, setLcs] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const code = `function LCS(str1, str2) {
  let m = str1.length, n = str2.length;
  let dp = Array(m + 1).fill(0)
    .map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i-1] === str2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }
  
  return dp[m][n];
}`;

  useEffect(() => {
    if (dp.length === 0) {
      const newDp = Array(str1.length + 1).fill(0).map(() => Array(str2.length + 1).fill(0));
      setDp(newDp);
    }
  }, [str1, str2, dp.length]);

  useEffect(() => {
    if (isPlaying && !finished) {
      intervalRef.current = window.setTimeout(() => {
        if (currentI <= str1.length && currentJ <= str2.length) {
          const newDp = dp.map(row => [...row]);
          
          if (currentJ > str2.length) {
            setCurrentI(currentI + 1);
            setCurrentJ(1);
          } else if (currentI === 0 || currentJ === 0) {
            setCurrentJ(currentJ + 1);
          } else {
            if (str1[currentI - 1] === str2[currentJ - 1]) {
              newDp[currentI][currentJ] = newDp[currentI - 1][currentJ - 1] + 1;
            } else {
              newDp[currentI][currentJ] = Math.max(newDp[currentI - 1][currentJ], newDp[currentI][currentJ - 1]);
            }
            setDp(newDp);
            setCurrentJ(currentJ + 1);
          }
          
          if (currentI === str1.length && currentJ === str2.length) {
            setFinished(true);
            setIsPlaying(false);
            
            // Backtrack to find LCS
            let i = str1.length, j = str2.length;
            let result = '';
            while (i > 0 && j > 0) {
              if (str1[i - 1] === str2[j - 1]) {
                result = str1[i - 1] + result;
                i--;
                j--;
              } else if (newDp[i - 1][j] > newDp[i][j - 1]) {
                i--;
              } else {
                j--;
              }
            }
            setLcs(result);
          }
        }
      }, 1000 / speed);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isPlaying, currentI, currentJ, str1, str2, dp, finished, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const handleReset = () => {
    setIsPlaying(false);
    const newDp = Array(str1.length + 1).fill(0).map(() => Array(str2.length + 1).fill(0));
    setDp(newDp);
    setCurrentI(0);
    setCurrentJ(0);
    setLcs('');
    setFinished(false);
  };

  const handleUpdate = () => {
    setStr1(inputStr1.toUpperCase());
    setStr2(inputStr2.toUpperCase());
    const newDp = Array(inputStr1.length + 1).fill(0).map(() => Array(inputStr2.length + 1).fill(0));
    setDp(newDp);
    setCurrentI(0);
    setCurrentJ(0);
    setLcs('');
    setFinished(false);
    setIsPlaying(false);
  };

  return (
    <AlgorithmLayout
      title="LCS - Longest Common Subsequence"
      isPlaying={isPlaying}
      onPlay={handlePlay}
      onPause={handlePause}
      onReset={handleReset}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: 'O(m × n)', space: 'O(m × n)' }}
      description="LCS finds the longest subsequence common to two sequences using dynamic programming."
      code={code}
    >
      <div className="space-y-6">
        <div className="flex gap-2">
          <Input value={inputStr1} onChange={(e) => setInputStr1(e.target.value)} placeholder="String 1" className="flex-1" />
          <Input value={inputStr2} onChange={(e) => setInputStr2(e.target.value)} placeholder="String 2" className="flex-1" />
          <Button onClick={handleUpdate} variant="outline">Update</Button>
        </div>

        {finished && (
          <div className="p-4 rounded-lg bg-green-100 border border-green-300">
            <p className="font-semibold text-green-800">LCS Length: {dp[str1.length][str2.length]}</p>
            <p className="font-semibold text-green-800">LCS: "{lcs}"</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="mx-auto border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-100"></th>
                <th className="border border-gray-300 p-2 bg-gray-100"></th>
                {str2.split('').map((char, idx) => (
                  <th key={idx} className="border border-gray-300 p-2 bg-gray-100 font-bold">{char}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dp.map((row, i) => (
                <tr key={i}>
                  <td className="border border-gray-300 p-2 bg-gray-100 font-bold">
                    {i === 0 ? '' : str1[i - 1]}
                  </td>
                  {row.map((cell, j) => {
                    const isActive = i === currentI && j === currentJ;
                    const isFilled = i < currentI || (i === currentI && j < currentJ);
                    
                    return (
                      <td
                        key={j}
                        className={`border border-gray-300 p-3 text-center font-semibold ${
                          isActive ? 'bg-yellow-300' : isFilled ? 'bg-green-200' : 'bg-white'
                        }`}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-6 justify-center pt-4 border-t">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-300 rounded"></div><span className="text-sm">Current</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-200 rounded"></div><span className="text-sm">Computed</span></div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm"><span className="font-semibold">String 1:</span> {str1}</p>
          <p className="text-sm"><span className="font-semibold">String 2:</span> {str2}</p>
          <p className="text-sm"><span className="font-semibold">Current Position:</span> [{currentI}, {currentJ}]</p>
        </div>
      </div>
    </AlgorithmLayout>
  );
}

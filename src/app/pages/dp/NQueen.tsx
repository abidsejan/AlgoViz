import { useState, useEffect, useRef } from 'react';
import AlgorithmLayout from '../../components/AlgorithmLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function NQueen() {
  const [n, setN] = useState(8);
  const [inputN, setInputN] = useState('8');
  const [board, setBoard] = useState<number[]>(Array(n).fill(-1));
  const [currentRow, setCurrentRow] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [solved, setSolved] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const code = `function solveNQueens(n) {
  let board = Array(n).fill(-1);
  
  function isSafe(row, col) {
    for (let i = 0; i < row; i++) {
      if (board[i] === col || 
          Math.abs(board[i] - col) === Math.abs(i - row)) {
        return false;
      }
    }
    return true;
  }
  
  function solve(row) {
    if (row === n) return true;
    
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row] = col;
        if (solve(row + 1)) return true;
        board[row] = -1;
      }
    }
    return false;
  }
  
  solve(0);
  return board;
}`;

  const isSafe = (row: number, col: number, currentBoard: number[]) => {
    for (let i = 0; i < row; i++) {
      if (currentBoard[i] === col || Math.abs(currentBoard[i] - col) === Math.abs(i - row)) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (isPlaying && !solved) {
      intervalRef.current = window.setTimeout(() => {
        const newBoard = [...board];
        
        if (currentRow >= n) {
          setSolved(true);
          setIsPlaying(false);
          return;
        }
        
        let placed = false;
        for (let col = (newBoard[currentRow] === -1 ? 0 : newBoard[currentRow] + 1); col < n; col++) {
          if (isSafe(currentRow, col, newBoard)) {
            newBoard[currentRow] = col;
            setBoard(newBoard);
            setCurrentRow(currentRow + 1);
            placed = true;
            break;
          }
        }
        
        if (!placed && currentRow > 0) {
          newBoard[currentRow] = -1;
          setBoard(newBoard);
          setCurrentRow(currentRow - 1);
        }
      }, 1000 / speed);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isPlaying, currentRow, board, n, solved, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const handleReset = () => {
    setIsPlaying(false);
    setBoard(Array(n).fill(-1));
    setCurrentRow(0);
    setSolved(false);
  };

  const handleUpdate = () => {
    const newN = parseInt(inputN) || 8;
    setN(newN);
    setBoard(Array(newN).fill(-1));
    setCurrentRow(0);
    setSolved(false);
    setIsPlaying(false);
  };

  const cellSize = Math.min(50, 400 / n);

  return (
    <AlgorithmLayout
      title="N-Queen Problem"
      isPlaying={isPlaying}
      onPlay={handlePlay}
      onPause={handlePause}
      onReset={handleReset}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: 'O(n!)', space: 'O(n)' }}
      description="N-Queen places N chess queens on an N×N board so that no two queens threaten each other using backtracking."
      code={code}
    >
      <div className="space-y-6">
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium">Board Size (N):</label>
          <Input
            type="number"
            min="4"
            max="12"
            value={inputN}
            onChange={(e) => setInputN(e.target.value)}
            className="w-20"
          />
          <Button onClick={handleUpdate} variant="outline" size="sm">Update</Button>
        </div>

        {solved && (
          <div className="p-4 rounded-lg bg-green-100 border border-green-300">
            <p className="font-semibold text-green-800">Solution found! All {n} queens placed safely.</p>
          </div>
        )}

        <div className="flex justify-center">
          <div 
            className="inline-grid gap-0 border-2 border-gray-800"
            style={{ 
              gridTemplateColumns: `repeat(${n}, ${cellSize}px)`,
            }}
          >
            {Array.from({ length: n * n }).map((_, idx) => {
              const row = Math.floor(idx / n);
              const col = idx % n;
              const isLight = (row + col) % 2 === 0;
              const hasQueen = board[row] === col;
              const isCurrentRow = row === currentRow;

              return (
                <div
                  key={idx}
                  className={`${isLight ? 'bg-amber-100' : 'bg-amber-600'} flex items-center justify-center font-bold text-2xl ${
                    isCurrentRow ? 'ring-2 ring-yellow-400' : ''
                  }`}
                  style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                >
                  {hasQueen && '♛'}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm"><span className="font-semibold">Board Size:</span> {n} × {n}</p>
          <p className="text-sm"><span className="font-semibold">Current Row:</span> {currentRow}</p>
          <p className="text-sm"><span className="font-semibold">Queens Placed:</span> {board.filter(q => q !== -1).length}</p>
        </div>
      </div>
    </AlgorithmLayout>
  );
}

import { useState } from 'react';
import type { Cell, GameConfig, Participant } from '../types';

interface GameBoardProps {
  config: GameConfig;
  cells: Cell[];
  currentPlayerIndex: number;
  onCellClick: (cellId: number) => void;
  loser: Participant | null;
}

export default function GameBoard({
  config,
  cells,
  currentPlayerIndex,
  onCellClick,
  loser,
}: GameBoardProps) {
  const [flipping, setFlipping] = useState<number | null>(null);
  const currentPlayer = config.participants[currentPlayerIndex];

  const handleClick = (cell: Cell) => {
    if (cell.revealed || loser) return;
    setFlipping(cell.id);
    setTimeout(() => {
      onCellClick(cell.id);
      setFlipping(null);
    }, 300);
  };

  const cols = config.gridSize <= 9 ? 3 : config.gridSize <= 12 ? 4 : config.gridSize <= 16 ? 4 : 5;

  return (
    <div className="space-y-5">
      {/* 현재 차례 표시 */}
      {!loser && (
        <div className="flex items-center justify-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl py-3 px-4">
          <span className="text-2xl">👆</span>
          <div>
            <p className="text-xs text-amber-600 font-semibold">지금 차례</p>
            <p className="text-lg font-black text-amber-800">{currentPlayer.name}</p>
          </div>
        </div>
      )}

      {/* 참가자 순서 표시 */}
      <div className="flex gap-1.5 flex-wrap justify-center">
        {config.participants.map((p, i) => (
          <span
            key={p.id}
            className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
              loser
                ? loser.id === p.id
                  ? 'bg-red-100 text-red-600 border border-red-300'
                  : 'bg-gray-100 text-gray-400'
                : i === currentPlayerIndex
                ? 'bg-amber-400 text-white scale-110 shadow-md shadow-amber-200'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {p.name}
          </span>
        ))}
      </div>

      {/* 게임 그리드 */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cells.map((cell) => (
          <button
            key={cell.id}
            onClick={() => handleClick(cell)}
            disabled={cell.revealed || !!loser}
            className={`
              aspect-square rounded-2xl text-2xl font-bold transition-all duration-200
              ${
                cell.revealed
                  ? cell.hasCoffee
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-300 scale-105'
                    : 'bg-green-100 border-2 border-green-200 text-green-500'
                  : flipping === cell.id
                  ? 'bg-amber-300 scale-95'
                  : 'bg-gradient-to-br from-slate-100 to-slate-200 hover:from-amber-100 hover:to-amber-200 hover:scale-105 active:scale-95 border border-slate-300 hover:border-amber-300 cursor-pointer shadow-sm'
              }
              ${!cell.revealed && !loser ? 'hover:shadow-md' : ''}
            `}
          >
            {cell.revealed
              ? cell.hasCoffee
                ? '☕'
                : '✓'
              : '?'}
          </button>
        ))}
      </div>

      {/* 남은 칸 수 */}
      {!loser && (
        <p className="text-center text-xs text-gray-400">
          남은 칸: {cells.filter((c) => !c.revealed).length}개 &nbsp;·&nbsp; 커피: {config.coffeeCount}개 숨어있음
        </p>
      )}
    </div>
  );
}

import { useState } from 'react';
import type { Cell, GameConfig, GamePhase, Participant } from './types';
import SetupPanel from './components/SetupPanel';
import GameBoard from './components/GameBoard';
import ResultScreen from './components/ResultScreen';

const DEFAULT_CONFIG: GameConfig = {
  participants: [
    { id: crypto.randomUUID(), name: '김철수' },
    { id: crypto.randomUUID(), name: '이영희' },
    { id: crypto.randomUUID(), name: '박민준' },
    { id: crypto.randomUUID(), name: '최수연' },
  ],
  gridSize: 12,
  coffeeCount: 1,
};

function buildCells(gridSize: number, coffeeCount: number): Cell[] {
  const cells: Cell[] = Array.from({ length: gridSize }, (_, i) => ({
    id: i,
    hasCoffee: false,
    revealed: false,
  }));

  // 랜덤하게 커피 배치
  const indices = [...Array(gridSize).keys()].sort(() => Math.random() - 0.5);
  for (let i = 0; i < coffeeCount; i++) {
    cells[indices[i]].hasCoffee = true;
  }

  return cells;
}

export default function App() {
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [cells, setCells] = useState<Cell[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [loser, setLoser] = useState<Participant | null>(null);

  const handleStartGame = () => {
    setCells(buildCells(config.gridSize, config.coffeeCount));
    setCurrentPlayerIndex(0);
    setLoser(null);
    setPhase('playing');
  };

  const handleCellClick = (cellId: number) => {
    const cell = cells.find((c) => c.id === cellId);
    if (!cell || cell.revealed) return;

    const newCells = cells.map((c) =>
      c.id === cellId ? { ...c, revealed: true } : c
    );
    setCells(newCells);

    if (cell.hasCoffee) {
      setLoser(config.participants[currentPlayerIndex]);
      setTimeout(() => setPhase('result'), 800);
    } else {
      setCurrentPlayerIndex((prev) => (prev + 1) % config.participants.length);
    }
  };

  const handleReplay = () => {
    setCells(buildCells(config.gridSize, config.coffeeCount));
    setCurrentPlayerIndex(0);
    setLoser(null);
    setPhase('playing');
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setCells([]);
    setCurrentPlayerIndex(0);
    setLoser(null);
    setPhase('setup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-amber-200 mb-3">
            <span className="text-3xl">☕</span>
          </div>
          <h1 className="text-3xl font-black text-gray-800">커피 찾기</h1>
          <p className="text-gray-400 mt-1 text-sm">칸을 골라 커피를 피하세요</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-amber-100 p-6 border border-amber-50">
          {phase === 'setup' && (
            <SetupPanel
              config={config}
              onConfigChange={setConfig}
              onStartGame={handleStartGame}
            />
          )}
          {phase === 'playing' && (
            <GameBoard
              config={config}
              cells={cells}
              currentPlayerIndex={currentPlayerIndex}
              onCellClick={handleCellClick}
              loser={loser}
            />
          )}
          {phase === 'result' && loser && (
            <ResultScreen
              loser={loser}
              onReset={handleReset}
              onReplay={handleReplay}
            />
          )}
        </div>

        <p className="text-center text-xs text-gray-300 mt-6">
          커피는 공정하게 랜덤으로 숨겨집니다
        </p>
      </div>
    </div>
  );
}

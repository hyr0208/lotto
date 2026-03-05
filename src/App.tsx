import { useState } from 'react';
import type { DrawConfig, DrawPhase, Participant } from './types';
import SetupPanel from './components/SetupPanel';
import DrawingScreen from './components/DrawingScreen';
import ResultScreen from './components/ResultScreen';

const DEFAULT_CONFIG: DrawConfig = {
  title: '오늘의 커피 당첨자',
  description: '',
  participants: [
    { id: crypto.randomUUID(), name: '김철수' },
    { id: crypto.randomUUID(), name: '이영희' },
    { id: crypto.randomUUID(), name: '박민준' },
    { id: crypto.randomUUID(), name: '최수연' },
  ],
  winnerCount: 1,
};

export default function App() {
  const [config, setConfig] = useState<DrawConfig>(DEFAULT_CONFIG);
  const [phase, setPhase] = useState<DrawPhase>('setup');
  const [winners, setWinners] = useState<Participant[]>([]);

  const handleStartDraw = () => setPhase('drawing');

  const handleDrawComplete = (result: Participant[]) => {
    setWinners(result);
    setPhase('result');
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setWinners([]);
    setPhase('setup');
  };

  const handleRedraw = () => {
    setWinners([]);
    setPhase('drawing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
            <span className="text-3xl">🎲</span>
          </div>
          <h1 className="text-3xl font-black text-gray-800">제비뽑기</h1>
          <p className="text-gray-400 mt-1 text-sm">공정한 랜덤 추첨 서비스</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 p-6 border border-indigo-50">
          {phase === 'setup' && (
            <SetupPanel
              config={config}
              onConfigChange={setConfig}
              onStartDraw={handleStartDraw}
            />
          )}
          {phase === 'drawing' && (
            <DrawingScreen config={config} onComplete={handleDrawComplete} />
          )}
          {phase === 'result' && (
            <ResultScreen
              config={config}
              winners={winners}
              onReset={handleReset}
              onRedraw={handleRedraw}
            />
          )}
        </div>

        <p className="text-center text-xs text-gray-300 mt-6">
          결과는 완전한 랜덤으로 결정됩니다
        </p>
      </div>
    </div>
  );
}

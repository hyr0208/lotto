import { useState } from 'react';
import type { GameConfig, Participant } from '../types';

interface SetupPanelProps {
  config: GameConfig;
  onConfigChange: (config: GameConfig) => void;
  onStartGame: () => void;
}

export default function SetupPanel({ config, onConfigChange, onStartGame }: SetupPanelProps) {
  const [newName, setNewName] = useState('');

  const addParticipant = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const participant: Participant = { id: crypto.randomUUID(), name: trimmed };
    onConfigChange({ ...config, participants: [...config.participants, participant] });
    setNewName('');
  };

  const removeParticipant = (id: string) => {
    onConfigChange({
      ...config,
      participants: config.participants.filter((p) => p.id !== id),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addParticipant();
  };

  const canStart = config.participants.length >= 2;

  return (
    <div className="space-y-6">
      {/* 타이틀 설명 */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 leading-relaxed">
        <p className="font-bold mb-1">게임 방법</p>
        <ol className="list-decimal list-inside space-y-0.5 text-amber-700">
          <li>참가자를 순서대로 추가하세요</li>
          <li>순서대로 돌아가며 네모칸을 하나씩 선택</li>
          <li>커피잔이 나오면 그 사람이 커피를 삽니다 ☕</li>
        </ol>
      </div>

      {/* 참가자 추가 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          참가자 추가
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="이름 입력 후 Enter"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          />
          <button
            onClick={addParticipant}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl transition active:scale-95"
          >
            추가
          </button>
        </div>
      </div>

      {/* 참가자 목록 */}
      {config.participants.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              참가자 순서 ({config.participants.length}명)
            </label>
            <button
              onClick={() => onConfigChange({ ...config, participants: [] })}
              className="text-xs text-red-400 hover:text-red-600 transition"
            >
              전체 삭제
            </button>
          </div>
          <div className="space-y-1.5">
            {config.participants.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-4 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-amber-400 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 font-medium">{p.name}</span>
                </div>
                <button
                  onClick={() => removeParticipant(p.id)}
                  className="text-gray-300 hover:text-red-400 transition text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 판 크기 / 커피 수 설정 */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">칸 수</label>
          <select
            value={config.gridSize}
            onChange={(e) => onConfigChange({ ...config, gridSize: parseInt(e.target.value) })}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          >
            {[9, 12, 16, 20].map((n) => (
              <option key={n} value={n}>{n}칸</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">커피 수</label>
          <select
            value={config.coffeeCount}
            onChange={(e) => onConfigChange({ ...config, coffeeCount: parseInt(e.target.value) })}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          >
            {[1, 2, 3].map((n) => (
              <option key={n} value={n}>{n}개</option>
            ))}
          </select>
        </div>
      </div>

      {/* 시작 버튼 */}
      <button
        onClick={onStartGame}
        disabled={!canStart}
        className={`w-full py-3.5 rounded-2xl text-white font-bold text-lg transition active:scale-95 ${
          canStart
            ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg shadow-amber-200'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {canStart ? '게임 시작! ☕' : '참가자를 2명 이상 추가하세요'}
      </button>
    </div>
  );
}

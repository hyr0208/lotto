import { useState } from 'react';
import type { DrawConfig, Participant } from '../types';

interface SetupPanelProps {
  config: DrawConfig;
  onConfigChange: (config: DrawConfig) => void;
  onStartDraw: () => void;
}

export default function SetupPanel({ config, onConfigChange, onStartDraw }: SetupPanelProps) {
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

  const handleBulkAdd = (text: string) => {
    const names = text
      .split(/[\n,]/)
      .map((n) => n.trim())
      .filter(Boolean);
    if (names.length === 0) return;
    const newParticipants: Participant[] = names.map((name) => ({
      id: crypto.randomUUID(),
      name,
    }));
    onConfigChange({ ...config, participants: [...config.participants, ...newParticipants] });
  };

  const canStart = config.participants.length >= 2 && config.winnerCount >= 1 && config.winnerCount < config.participants.length;

  return (
    <div className="space-y-6">
      {/* 뽑기 제목 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">뽑기 제목</label>
        <input
          type="text"
          value={config.title}
          onChange={(e) => onConfigChange({ ...config, title: e.target.value })}
          placeholder="예: 오늘의 커피 당첨자"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>

      {/* 설명 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">설명 (선택)</label>
        <input
          type="text"
          value={config.description}
          onChange={(e) => onConfigChange({ ...config, description: e.target.value })}
          placeholder="예: 오늘 커피는 이 분이 쏩니다!"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>

      {/* 당첨자 수 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          당첨 인원 수
        </label>
        <input
          type="number"
          min={1}
          max={Math.max(1, config.participants.length - 1)}
          value={config.winnerCount}
          onChange={(e) =>
            onConfigChange({ ...config, winnerCount: Math.max(1, parseInt(e.target.value) || 1) })
          }
          className="w-24 border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
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
            placeholder="이름 입력 후 Enter 또는 추가 버튼"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <button
            onClick={addParticipant}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl transition active:scale-95"
          >
            추가
          </button>
        </div>

        {/* 일괄 입력 */}
        <details className="mt-2">
          <summary className="text-sm text-indigo-500 cursor-pointer hover:text-indigo-700 select-none">
            여러 명 한번에 추가하기
          </summary>
          <textarea
            rows={4}
            placeholder="이름을 줄바꿈 또는 쉼표로 구분해서 입력&#10;예: 김철수, 이영희&#10;박민준"
            className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-sm"
            onBlur={(e) => {
              if (e.target.value.trim()) {
                handleBulkAdd(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </details>
      </div>

      {/* 참가자 목록 */}
      {config.participants.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              참가자 목록 ({config.participants.length}명)
            </label>
            <button
              onClick={() => onConfigChange({ ...config, participants: [] })}
              className="text-xs text-red-400 hover:text-red-600 transition"
            >
              전체 삭제
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {config.participants.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full border border-indigo-200"
              >
                {p.name}
                <button
                  onClick={() => removeParticipant(p.id)}
                  className="text-indigo-400 hover:text-red-500 transition leading-none"
                  aria-label={`${p.name} 제거`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 시작 버튼 */}
      <button
        onClick={onStartDraw}
        disabled={!canStart}
        className={`w-full py-3.5 rounded-2xl text-white font-bold text-lg transition active:scale-95 ${
          canStart
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-200'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {!canStart && config.participants.length < 2
          ? '참가자를 2명 이상 추가하세요'
          : !canStart
          ? `당첨 인원은 ${config.participants.length - 1}명 이하여야 해요`
          : '뽑기 시작!'}
      </button>
    </div>
  );
}

import type { DrawConfig, Participant } from '../types';

interface ResultScreenProps {
  config: DrawConfig;
  winners: Participant[];
  onReset: () => void;
  onRedraw: () => void;
}

const MEDAL = ['🥇', '🥈', '🥉'];

export default function ResultScreen({ config, winners, onReset, onRedraw }: ResultScreenProps) {
  const losers = config.participants.filter((p) => !winners.find((w) => w.id === p.id));

  return (
    <div className="space-y-6 text-center">
      <div>
        <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-1">결과 발표</p>
        <h2 className="text-2xl font-black text-gray-800">{config.title}</h2>
        {config.description && <p className="text-gray-500 mt-1">{config.description}</p>}
      </div>

      {/* 당첨자 카드 */}
      <div className="space-y-3">
        {winners.map((winner, i) => (
          <div
            key={winner.id}
            className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm"
            style={{ animation: `slideIn 0.4s ease-out ${i * 0.15}s both` }}
          >
            <span className="text-3xl">{MEDAL[i] ?? '🎉'}</span>
            <div className="text-left">
              <p className="text-xs text-indigo-400 font-semibold">
                {config.winnerCount > 1 ? `${i + 1}번째 당첨` : '당첨자'}
              </p>
              <p className="text-xl font-black text-indigo-700">{winner.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 나머지 참가자 */}
      {losers.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 mb-2">이번엔 아쉽게도...</p>
          <div className="flex flex-wrap justify-center gap-2">
            {losers.map((p) => (
              <span
                key={p.id}
                className="text-sm text-gray-500 bg-gray-100 rounded-full px-3 py-1"
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onRedraw}
          className="flex-1 py-3 rounded-2xl border-2 border-indigo-400 text-indigo-600 font-bold hover:bg-indigo-50 transition active:scale-95"
        >
          다시 뽑기
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-200 transition active:scale-95"
        >
          처음으로
        </button>
      </div>
    </div>
  );
}

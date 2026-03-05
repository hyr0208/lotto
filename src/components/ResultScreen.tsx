import type { Room } from "../types";
import { getPlayerId } from "../roomService";

interface ResultScreenProps {
  room: Room;
  onReset: () => void;
  onReplay: () => void;
}

export default function ResultScreen({
  room,
  onReset,
  onReplay,
}: ResultScreenProps) {
  const myId = getPlayerId();
  const isHost = room.hostId === myId;
  const loser = room.loserId
    ? Object.values(room.players).find((p) => p.id === room.loserId)
    : null;

  if (!loser) return null;

  const isMe = loser.id === myId;

  return (
    <div className="text-center space-y-6">
      {/* 폭발 이모지 */}
      <div className="text-7xl animate-bounce">☕</div>

      <div>
        <p className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-2">
          커피 당첨!
        </p>
        <h2 className="text-4xl font-black text-gray-800">{loser.name}</h2>
        <p className="text-gray-500 mt-2 text-base">
          {isMe ? (
            <>
              오늘 커피는 <span className="font-bold text-amber-600">내가</span>{" "}
              쏩니다 😅
            </>
          ) : (
            <>
              오늘 커피는{" "}
              <span className="font-bold text-amber-600">{loser.name}</span>님이
              쏩니다 🎉
            </>
          )}
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl py-4 px-6 text-amber-700 text-sm">
        커피 한 잔의 여유, 다들 맛있게 드세요 ☕
      </div>

      {isHost ? (
        <div className="flex gap-3 pt-2">
          <button
            onClick={onReplay}
            className="flex-1 py-3 rounded-2xl border-2 border-amber-400 text-amber-600 font-bold hover:bg-amber-50 transition active:scale-95"
          >
            같은 멤버로 다시
          </button>
          <button
            onClick={onReset}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold hover:from-amber-500 hover:to-orange-600 shadow-lg shadow-amber-200 transition active:scale-95"
          >
            로비로 돌아가기
          </button>
        </div>
      ) : (
        <div className="text-sm text-gray-400 font-medium pt-2">
          방장이 다음 게임을 시작할 때까지 기다려주세요
        </div>
      )}
    </div>
  );
}

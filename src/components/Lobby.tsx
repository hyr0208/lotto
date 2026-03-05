import type { Room, Player } from "../types";
import { updateConfig, getPlayerId } from "../roomService";

interface LobbyProps {
  roomCode: string;
  room: Room;
  onStartGame: () => void;
}

export default function Lobby({ roomCode, room, onStartGame }: LobbyProps) {
  const myId = getPlayerId();
  const isHost = room.hostId === myId;
  const players = Object.values(room.players || {}).sort(
    (a: Player, b: Player) => a.order - b.order,
  );
  const canStart = players.length >= 2;
  const shareUrl = `${window.location.origin}/room/${roomCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("링크가 복사되었습니다!");
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      alert("링크가 복사되었습니다!");
    }
  };

  return (
    <div className="space-y-5">
      {/* 방 코드 */}
      <div className="text-center">
        <p className="text-xs text-gray-400 font-semibold mb-1">방 코드</p>
        <p className="text-3xl font-black text-amber-600 tracking-widest font-mono">
          {roomCode}
        </p>
      </div>

      {/* 초대 링크 */}
      <button
        onClick={handleCopy}
        className="w-full py-3 rounded-2xl border-2 border-dashed border-amber-300 text-amber-600 font-semibold hover:bg-amber-50 transition active:scale-95 text-sm"
      >
        📋 초대 링크 복사하기
      </button>

      {/* 참가자 목록 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">
            참가자 ({players.length}명)
          </label>
          {players.length < 2 && (
            <span className="text-xs text-amber-500 font-medium animate-pulse">
              대기 중...
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          {players.map((p: Player, i: number) => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-amber-400 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-gray-700 font-medium">{p.name}</span>
                {p.id === myId && (
                  <span className="text-xs text-amber-500 font-semibold">
                    (나)
                  </span>
                )}
              </div>
              {p.id === room.hostId && (
                <span className="text-xs bg-amber-400 text-white px-2 py-0.5 rounded-full font-semibold">
                  방장
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 게임 설정 - 호스트만 변경 가능 */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            칸 수
          </label>
          <select
            value={room.config.gridSize}
            onChange={(e) =>
              updateConfig(roomCode, {
                ...room.config,
                gridSize: parseInt(e.target.value),
              })
            }
            disabled={!isHost}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition disabled:bg-gray-100 disabled:text-gray-400"
          >
            {[9, 12, 16, 20].map((n) => (
              <option key={n} value={n}>
                {n}칸
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            커피 수
          </label>
          <select
            value={room.config.coffeeCount}
            onChange={(e) =>
              updateConfig(roomCode, {
                ...room.config,
                coffeeCount: parseInt(e.target.value),
              })
            }
            disabled={!isHost}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition disabled:bg-gray-100 disabled:text-gray-400"
          >
            {[1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n}개
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 게임 시작 버튼 */}
      {isHost ? (
        <button
          onClick={onStartGame}
          disabled={!canStart}
          className={`w-full py-3.5 rounded-2xl text-white font-bold text-lg transition active:scale-95 ${
            canStart
              ? "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg shadow-amber-200"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {canStart ? "게임 시작! ☕" : "참가자를 기다리는 중..."}
        </button>
      ) : (
        <div className="text-center py-3.5 rounded-2xl bg-gray-100 text-gray-500 font-semibold">
          방장이 게임을 시작할 때까지 기다려주세요
        </div>
      )}

      {/* 게임 방법 */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 leading-relaxed">
        <p className="font-bold mb-1">게임 방법</p>
        <ol className="list-decimal list-inside space-y-0.5 text-amber-700">
          <li>참가자가 모이면 방장이 게임을 시작합니다</li>
          <li>자기 차례에만 네모칸을 하나 선택할 수 있어요</li>
          <li>커피잔이 나오면 그 사람이 커피를 삽니다 ☕</li>
        </ol>
      </div>
    </div>
  );
}

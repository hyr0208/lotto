import { useState, useEffect } from "react";
import type { Cell, Room, Player } from "../types";

const TURN_TIMEOUT_MS = 10000; // 10초

interface GameBoardProps {
  room: Room;
  myPlayerId: string;
  onCellClick: (cellId: number) => void;
  onTimeout: () => void;
}

export default function GameBoard({
  room,
  myPlayerId,
  onCellClick,
  onTimeout,
}: GameBoardProps) {
  const [flipping, setFlipping] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(10);
  const players = Object.values(room.players).sort(
    (a: Player, b: Player) => a.order - b.order,
  );
  const currentPlayer = players[room.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === myPlayerId;
  const loser = room.loserId
    ? Object.values(room.players).find((p) => p.id === room.loserId)
    : null;

  // 카운트다운 타이머
  useEffect(() => {
    if (!room.turnStartedAt || loser || room.phase !== "playing") {
      setCountdown(10);
      return;
    }

    const tick = () => {
      const elapsed = Date.now() - room.turnStartedAt!;
      const remaining = Math.max(
        0,
        Math.ceil((TURN_TIMEOUT_MS - elapsed) / 1000),
      );
      setCountdown(remaining);

      if (remaining <= 0 && isMyTurn) {
        onTimeout();
      }
    };

    tick();
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [
    room.turnStartedAt,
    room.currentPlayerIndex,
    loser,
    room.phase,
    isMyTurn,
    onTimeout,
  ]);

  const handleClick = (cell: Cell) => {
    if (cell.revealed || loser || !isMyTurn) return;
    setFlipping(cell.id);
    setTimeout(() => {
      onCellClick(cell.id);
      setFlipping(null);
    }, 300);
  };

  const cols =
    room.config.gridSize <= 9
      ? 3
      : room.config.gridSize <= 12
        ? 4
        : room.config.gridSize <= 16
          ? 4
          : 5;

  const cells = room.cells || [];
  const timerColor =
    countdown <= 3
      ? "text-red-500"
      : countdown <= 5
        ? "text-orange-500"
        : "text-amber-600";
  const timerBg =
    countdown <= 3
      ? "bg-red-50 border-red-300"
      : countdown <= 5
        ? "bg-orange-50 border-orange-300"
        : "bg-amber-50 border-amber-200";

  return (
    <div className="space-y-5">
      {/* 현재 차례 + 타이머 */}
      {!loser && (
        <div
          className={`flex items-center justify-between rounded-2xl py-3 px-4 border ${
            isMyTurn
              ? "bg-green-50 border-green-300"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isMyTurn ? "👆" : "⏳"}</span>
            <div>
              <p
                className={`text-xs font-semibold ${
                  isMyTurn ? "text-green-600" : "text-amber-600"
                }`}
              >
                {isMyTurn ? "내 차례!" : "상대 차례"}
              </p>
              <p
                className={`text-lg font-black ${
                  isMyTurn ? "text-green-800" : "text-amber-800"
                }`}
              >
                {currentPlayer?.name}
              </p>
            </div>
          </div>
          {/* 타이머 */}
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${timerBg}`}
          >
            <span className={`text-xl font-black ${timerColor}`}>
              {countdown}
            </span>
          </div>
        </div>
      )}

      {/* 참가자 순서 표시 */}
      <div className="flex gap-1.5 flex-wrap justify-center">
        {players.map((p: Player, i: number) => (
          <span
            key={p.id}
            className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
              loser
                ? room.loserId === p.id
                  ? "bg-red-100 text-red-600 border border-red-300"
                  : "bg-gray-100 text-gray-400"
                : i === room.currentPlayerIndex
                  ? "bg-amber-400 text-white scale-110 shadow-md shadow-amber-200"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            {p.name}
            {p.id === myPlayerId ? "(나)" : ""}
          </span>
        ))}
      </div>

      {/* 게임 그리드 */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cells.map((cell: Cell) => (
          <button
            key={cell.id}
            onClick={() => handleClick(cell)}
            disabled={cell.revealed || !!loser || !isMyTurn}
            className={`
              aspect-square rounded-2xl text-2xl font-bold transition-all duration-200
              ${
                cell.revealed
                  ? cell.hasCoffee
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-300 scale-105"
                    : "bg-green-100 border-2 border-green-200 text-green-500"
                  : flipping === cell.id
                    ? "bg-amber-300 scale-95"
                    : isMyTurn
                      ? "bg-gradient-to-br from-slate-100 to-slate-200 hover:from-amber-100 hover:to-amber-200 hover:scale-105 active:scale-95 border border-slate-300 hover:border-amber-300 cursor-pointer shadow-sm"
                      : "bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 opacity-70 cursor-not-allowed"
              }
              ${!cell.revealed && !loser && isMyTurn ? "hover:shadow-md" : ""}
            `}
          >
            {cell.revealed ? (cell.hasCoffee ? "☕" : "✓") : "?"}
          </button>
        ))}
      </div>

      {/* 남은 칸 수 */}
      {!loser && (
        <p className="text-center text-xs text-gray-400">
          남은 칸: {cells.filter((c: Cell) => !c.revealed).length}개
          &nbsp;·&nbsp; 커피: {room.config.coffeeCount}개 숨어있음
        </p>
      )}
    </div>
  );
}

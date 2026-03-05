import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Room } from "../types";
import {
  subscribeRoom,
  joinRoom,
  startGame,
  clickCell,
  replayGame,
  goToLobby,
  getPlayerId,
  getPlayerName,
} from "../roomService";
import Lobby from "./Lobby";
import GameBoard from "./GameBoard";
import ResultScreen from "./ResultScreen";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const roomCode = roomId?.toUpperCase() || "";

  // 방 입장 처리
  useEffect(() => {
    if (!roomCode) return;

    const playerName = getPlayerName();
    const playerId = getPlayerId();

    // 방 구독 시작
    const unsubscribe = subscribeRoom(roomCode, (roomData) => {
      setRoom(roomData);
      setLoading(false);

      // 방이 존재하고, 내가 아직 참가하지 않았고, 로비 상태면 자동 참가
      if (
        roomData &&
        roomData.phase === "lobby" &&
        !roomData.players?.[playerId] &&
        !joining
      ) {
        if (playerName) {
          setJoining(true);
          joinRoom(roomCode, playerName).finally(() => setJoining(false));
        }
      }
    });

    return () => unsubscribe();
  }, [roomCode]);

  // 닉네임 없이 접근 시 입력 받기
  const [tempName, setTempName] = useState("");
  const myId = getPlayerId();
  const needsName =
    room && room.phase === "lobby" && !room.players?.[myId] && !getPlayerName();

  const handleJoinWithName = async () => {
    const trimmed = tempName.trim();
    if (!trimmed) return;
    setJoining(true);
    await joinRoom(roomCode, trimmed);
    setJoining(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">☕</div>
          <p className="text-gray-500 font-medium">방에 접속 중...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-4">😢</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            방을 찾을 수 없습니다
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            만료되었거나 존재하지 않는 방입니다
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-lg shadow-amber-200 transition active:scale-95"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 이름 입력이 필요한 경우
  if (needsName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-amber-200 mb-3">
              <span className="text-3xl">☕</span>
            </div>
            <h1 className="text-2xl font-black text-gray-800">게임에 참가</h1>
            <p className="text-gray-400 mt-1 text-sm">이름을 입력해주세요</p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl shadow-amber-100 p-6 border border-amber-50">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing)
                  handleJoinWithName();
              }}
              placeholder="이름 입력"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition mb-4"
              autoFocus
            />
            <button
              onClick={handleJoinWithName}
              disabled={joining || !tempName.trim()}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg shadow-amber-200 transition active:scale-95 disabled:opacity-50"
            >
              {joining ? "참가 중..." : "참가하기"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-amber-200 mb-3">
            <span className="text-3xl">☕</span>
          </div>
          <h1 className="text-3xl font-black text-gray-800">커피 찾기</h1>
          {room.phase === "playing" && (
            <p className="text-gray-400 mt-1 text-sm">
              칸을 골라 커피를 피하세요
            </p>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-amber-100 p-6 border border-amber-50">
          {room.phase === "lobby" && (
            <Lobby
              roomCode={roomCode}
              room={room}
              onStartGame={() => startGame(roomCode)}
            />
          )}
          {room.phase === "playing" && room.cells && (
            <GameBoard
              room={room}
              myPlayerId={myId}
              onCellClick={(cellId) => clickCell(roomCode, cellId)}
            />
          )}
          {room.phase === "result" && room.loserId && (
            <ResultScreen
              room={room}
              onReplay={() => replayGame(roomCode)}
              onReset={() => goToLobby(roomCode)}
            />
          )}
        </div>

        <p className="text-center text-xs text-gray-300 mt-6">
          {room.phase === "lobby"
            ? "방을 만들고 친구에게 링크를 공유하세요"
            : "커피는 공정하게 랜덤으로 숨겨집니다"}
        </p>
      </div>
    </div>
  );
}

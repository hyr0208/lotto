import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createRoom,
  joinRoom,
  getPlayerName,
  setPlayerName,
} from "../roomService";

export default function HomePage() {
  const navigate = useNavigate();
  const [name, setName] = useState(getPlayerName());
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"home" | "join">("home");

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("이름을 입력해주세요");
      return;
    }
    setLoading(true);
    setError("");
    try {
      setPlayerName(trimmed);
      const code = await createRoom(trimmed);
      navigate(`/room/${code}`);
    } catch {
      setError("방 생성에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    const trimmed = name.trim();
    const code = roomCode.trim().toUpperCase();
    if (!trimmed) {
      setError("이름을 입력해주세요");
      return;
    }
    if (!code) {
      setError("방 코드를 입력해주세요");
      return;
    }
    setLoading(true);
    setError("");
    try {
      setPlayerName(trimmed);
      const result = await joinRoom(code, trimmed);
      if (result.success) {
        navigate(`/room/${code}`);
      } else {
        setError(result.error || "참가에 실패했습니다");
      }
    } catch {
      setError("참가에 실패했습니다");
    } finally {
      setLoading(false);
    }
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
          <p className="text-gray-400 mt-1 text-sm">
            링크를 공유하고 함께 플레이하세요
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-amber-100 p-6 border border-amber-50">
          {/* 이름 입력 */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              내 이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="이름을 입력하세요"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
          </div>

          {mode === "home" ? (
            <div className="space-y-3">
              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg shadow-amber-200 transition active:scale-95 disabled:opacity-50"
              >
                {loading ? "생성 중..." : "🎲 방 만들기"}
              </button>

              <button
                onClick={() => setMode("join")}
                className="w-full py-3.5 rounded-2xl border-2 border-amber-400 text-amber-600 font-bold text-lg hover:bg-amber-50 transition active:scale-95"
              >
                🔗 코드로 참가하기
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  방 코드
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => {
                    setRoomCode(e.target.value.toUpperCase());
                    setError("");
                  }}
                  placeholder="6자리 코드 입력"
                  maxLength={6}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 text-center text-xl font-mono tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition uppercase"
                />
              </div>

              <button
                onClick={handleJoin}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg shadow-amber-200 transition active:scale-95 disabled:opacity-50"
              >
                {loading ? "참가 중..." : "참가하기"}
              </button>

              <button
                onClick={() => {
                  setMode("home");
                  setError("");
                }}
                className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition"
              >
                ← 돌아가기
              </button>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <p className="text-red-500 text-sm text-center mt-3 font-medium">
              {error}
            </p>
          )}
        </div>

        <p className="text-center text-xs text-gray-300 mt-6">
          방을 만들고 친구에게 링크를 공유하세요
        </p>
      </div>
    </div>
  );
}

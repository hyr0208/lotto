import { ref, set, get, update, onValue, push, off } from "firebase/database";
import { db } from "./firebase";
import type { Room, Cell, Player } from "./types";

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function buildCells(gridSize: number, coffeeCount: number): Cell[] {
  const cells: Cell[] = Array.from({ length: gridSize }, (_, i) => ({
    id: i,
    hasCoffee: false,
    revealed: false,
  }));
  const indices = [...Array(gridSize).keys()].sort(() => Math.random() - 0.5);
  for (let i = 0; i < coffeeCount; i++) {
    cells[indices[i]].hasCoffee = true;
  }
  return cells;
}

export function getPlayerId(): string {
  let id = localStorage.getItem("coffee-player-id");
  if (!id) {
    id = push(ref(db)).key!;
    localStorage.setItem("coffee-player-id", id);
  }
  return id;
}

export function getPlayerName(): string {
  return localStorage.getItem("coffee-player-name") || "";
}

export function setPlayerName(name: string) {
  localStorage.setItem("coffee-player-name", name);
}

export async function createRoom(hostName: string): Promise<string> {
  const hostId = getPlayerId();
  setPlayerName(hostName);

  const roomCode = generateRoomCode();
  const room: Room = {
    hostId,
    phase: "lobby",
    config: { gridSize: 12, coffeeCount: 1 },
    players: {
      [hostId]: { id: hostId, name: hostName, order: 0 },
    },
    cells: [],
    currentPlayerIndex: 0,
    loserId: null,
    turnStartedAt: null,
    createdAt: Date.now(),
  };

  await set(ref(db, `rooms/${roomCode}`), room);
  return roomCode;
}

export async function joinRoom(
  roomCode: string,
  playerName: string,
): Promise<{ success: boolean; error?: string }> {
  const playerId = getPlayerId();
  setPlayerName(playerName);

  const roomRef = ref(db, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    return { success: false, error: "존재하지 않는 방입니다" };
  }

  const room = snapshot.val() as Room;

  if (room.phase !== "lobby") {
    return { success: false, error: "이미 게임이 진행 중입니다" };
  }

  // 이미 참가중이면 그냥 성공
  if (room.players?.[playerId]) {
    return { success: true };
  }

  const playerCount = Object.keys(room.players || {}).length;
  const player: Player = { id: playerId, name: playerName, order: playerCount };

  await update(ref(db, `rooms/${roomCode}/players/${playerId}`), player);
  return { success: true };
}

export function subscribeRoom(
  roomCode: string,
  callback: (room: Room | null) => void,
): () => void {
  const roomRef = ref(db, `rooms/${roomCode}`);
  const handler = onValue(roomRef, (snapshot) => {
    callback(snapshot.exists() ? (snapshot.val() as Room) : null);
  });
  return () => off(roomRef, "value", handler);
}

export async function updateConfig(
  roomCode: string,
  config: { gridSize: number; coffeeCount: number },
) {
  await update(ref(db, `rooms/${roomCode}/config`), config);
}

export async function startGame(roomCode: string) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  if (!snapshot.exists()) return;
  const room = snapshot.val() as Room;

  const cells = buildCells(room.config.gridSize, room.config.coffeeCount);

  await update(ref(db, `rooms/${roomCode}`), {
    phase: "playing",
    cells,
    currentPlayerIndex: 0,
    loserId: null,
    turnStartedAt: Date.now(),
  });
}

export async function clickCell(roomCode: string, cellId: number) {
  const playerId = getPlayerId();
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  if (!snapshot.exists()) return;
  const room = snapshot.val() as Room;

  if (room.phase !== "playing") return;

  // 순서 정렬된 플레이어 배열
  const players = Object.values(room.players).sort((a, b) => a.order - b.order);
  const currentPlayer = players[room.currentPlayerIndex];
  if (currentPlayer.id !== playerId) return; // 차례가 아님

  const cell = room.cells[cellId];
  if (!cell || cell.revealed) return;

  // 셀 공개
  const updates: Record<string, unknown> = {
    [`cells/${cellId}/revealed`]: true,
  };

  if (cell.hasCoffee) {
    updates["loserId"] = playerId;
    updates["phase"] = "result";
    updates["turnStartedAt"] = null;
  } else {
    updates["currentPlayerIndex"] =
      (room.currentPlayerIndex + 1) % players.length;
    updates["turnStartedAt"] = Date.now();
  }

  await update(ref(db, `rooms/${roomCode}`), updates);
}

export async function replayGame(roomCode: string) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  if (!snapshot.exists()) return;
  const room = snapshot.val() as Room;

  const cells = buildCells(room.config.gridSize, room.config.coffeeCount);

  await update(ref(db, `rooms/${roomCode}`), {
    phase: "playing",
    cells,
    currentPlayerIndex: 0,
    loserId: null,
    turnStartedAt: Date.now(),
  });
}

export async function timeoutCurrentPlayer(roomCode: string) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  if (!snapshot.exists()) return;
  const room = snapshot.val() as Room;
  if (room.phase !== "playing") return;

  const players = Object.values(room.players).sort((a, b) => a.order - b.order);
  const currentPlayer = players[room.currentPlayerIndex];

  await update(ref(db, `rooms/${roomCode}`), {
    loserId: currentPlayer.id,
    phase: "result",
    turnStartedAt: null,
  });
}

export async function goToLobby(roomCode: string) {
  await update(ref(db, `rooms/${roomCode}`), {
    phase: "lobby",
    cells: [],
    currentPlayerIndex: 0,
    loserId: null,
    turnStartedAt: null,
  });
}

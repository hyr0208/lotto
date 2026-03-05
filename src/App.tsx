import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import RoomPage from "./components/RoomPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room/:roomId" element={<RoomPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

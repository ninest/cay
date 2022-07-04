import { IndexPage } from "@/routes";
import { GamePage } from "@/routes/game";
import { Route, Routes } from "react-router-dom";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="game" element={<GamePage />} />
    </Routes>
  );
};

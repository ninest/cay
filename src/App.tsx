import { Route, Routes } from "react-router-dom";
import { IndexPage } from "./routes";
import { GamePage } from "./routes/game";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="game" element={<GamePage />} />
    </Routes>
  );
};

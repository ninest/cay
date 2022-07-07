import { StartPage } from "@/routes/start";
import { GamePage } from "@/routes/game";
import { Route, Routes, useParams } from "react-router-dom";
import { IndexPage } from "./routes";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/start/:roomId" element={<StartPage />} />
      <Route path="/game/:roomId" element={<GamePage />} />
    </Routes>
  );
};

import { RoomProvider } from "@/liveblocks";
import { GamePage } from "@/routes/game";
import { StartPage } from "@/routes/start";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import {
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { blackCardsCAH, whiteCardsCAH } from "./cards";
import { IndexPage } from "./routes";
import { fakePlayerName } from "./utils/names";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      {/*  */}
      <Route path="/:roomId" element={<Game />}>
        <Route path="/:roomId/start" element={<StartPage />} />
        <Route path="/:roomId/game" element={<GamePage />} />
      </Route>
    </Routes>
  );
};

const Game = () => {
  const navigate = useNavigate();
  let { roomId } = useParams();

  if (!roomId) {
    navigate("/");
  }
  return (
    <RoomProvider
      id={roomId!}
      initialPresence={{
        name: fakePlayerName(),
      }}
      initialStorage={{
        config: new LiveObject({
          started: false,
          leader: 0,
          reader: 0,
          currentBlackCard: null,
        }),
        whiteCards: new LiveList(whiteCardsCAH),
        blackCards: new LiveList(blackCardsCAH),
        hands: new LiveMap([]),
        submittedWhiteCards: new LiveList([]),
        scores: new LiveMap([]),
      }}
    >
      <Outlet />
    </RoomProvider>
  );
};

import { middleware } from "@liveblocks/zustand";
import create, { StateCreator } from "zustand";
import { client } from "../liveblocks";
import { LiveblocksStore } from "../types/zustand";

interface State {
  name: null | string;
  setName: (name: string) => void;
  started: boolean;

  // List of connectionIds who want to start the game
  playersStarted: number[];
  requestStart: (connectionId: number) => void;
  gameStarted: boolean;
  setGameStarted: (gameStarted: boolean) => void;

  // Reset everything
  reset: () => void;
}
const createStateSlice: StateCreator<State, [], []> = (set, get) => ({
  name: null,
  setName: (name) => {
    set({ name });
  },
  started: false,

  playersStarted: [],
  requestStart: (connectionId: number) => {
    if (!get().playersStarted.includes(connectionId)) {
      set({ playersStarted: [...get().playersStarted, connectionId] });
      set({ started: true });
    }
  },
  gameStarted: false,
  setGameStarted: (gameStarted) => {
    set({ gameStarted });
  },

  reset: () => {
    set({ playersStarted: [], gameStarted: false });
  },
});

export const useStore: LiveblocksStore<State> = create<State>()(
  // @ts-ignore
  middleware(
    // @ts-ignore
    (...a) => ({
      // @ts-ignore
      ...createStateSlice(...a),
    }),
    {
      client,
      presenceMapping: {
        name: true,
        started: true,
      },
      storageMapping: {
        playersStarted: true,
        gameStarted: true,
      },
    }
  )
);

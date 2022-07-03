import { middleware } from "@liveblocks/zustand";
import create, { StateCreator } from "zustand";
import { client } from "../liveblocks";
import { LiveblocksStore } from "../types/zustand";

interface State {
  me: { name?: string };
  setName: (name: string) => void;
}
const createStateSlice: StateCreator<State, [], []> = (set, get) => ({
  me: {},
  setName: (name) => {
    set({ ...get(), me: { ...get().me, name } });
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
        me: true,
      },
    }
  )
);

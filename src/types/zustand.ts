import { StoreApi, UseBoundStore } from "zustand";

type LiveblocksState = {
  liveblocks: { enterRoom: Function; leaveRoom: Function; others: any };
};
export type LiveblocksStore<T extends object> = UseBoundStore<
  StoreApi<T & LiveblocksState>
>;

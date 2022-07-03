import { StoreApi, UseBoundStore } from "zustand";

type LiveblocksState = {
  liveblocks: {
    enterRoom: Function;
    leaveRoom: Function;
    others: { connectionId: number; presence: any }[];
    connection:
      | "authenticating"
      | "connecting"
      | "open"
      | "failed"
      | "closed"
      | "unavailable";
  };
};
export type LiveblocksStore<T extends object> = UseBoundStore<
  StoreApi<T & LiveblocksState>
>;

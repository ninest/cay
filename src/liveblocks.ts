import {
  createClient,
  LiveList,
  LiveMap,
  LiveObject,
} from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

export const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY,
});

export type Presence = {
  name: string | null;
};

type Config = {
  started: boolean;
  leader: number;
  reader: number;
};
type Card = {};

type Storage = {
  config: LiveObject<Config>;
  whiteCards: LiveList<Card>;
  blackCards: LiveList<Card>;
};

export const {
  RoomProvider,
  useMyPresence,
  useOthers,
  useUpdateMyPresence,
  useObject,
  useList,
  useMap,
  useStorage,
  useSelf,
  useRoom,
} = createRoomContext<Presence, Storage>(client);

import { createClient, LiveList } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

export const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY,
});

type Presence = {
  name: string | null;
};

type Card = {};

type Storage = {
  whiteCards: LiveList<Card>;
  blackCards: LiveList<Card>;
};

export const {
  RoomProvider,
  useMyPresence,
  useUpdateMyPresence,
  useObject,
  useList,
  useStorage,
  useRoom,
} = createRoomContext<Presence, Storage>(client);

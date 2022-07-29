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
  currentBlackCard: number | null;
};
export type WhiteCard = { text: string; pack: number };
type SubmittedWhiteCards = { playerId: number; whiteCards: WhiteCard[] };
export type BlackCard = WhiteCard & { pick: number };

type Storage = {
  config: LiveObject<Config>;
  hands: LiveMap<string, WhiteCard[]>;
  whiteCards: LiveList<WhiteCard>;
  blackCards: LiveList<BlackCard>;
  submittedWhiteCards: LiveList<SubmittedWhiteCards>;
  // Mapping of playerId to score
  scores: LiveMap<string, number>;
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

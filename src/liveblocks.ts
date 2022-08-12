import {
  createClient,
  LiveList,
  LiveMap,
  LiveObject,
} from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { BlackCard, WhiteCard } from "./types";

export const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY,
});

export type Presence = {
  name: string | null;
};

type Config = {
  timeStarted: string; // datetime the game was created
  started: boolean; // Have the players left the starting screen
  gameStarted: boolean; //Has the first round started?
  leader: number;
  reader: number;
  currentBlackCard: number | null;
};

export type SubmittedWhiteCards = { playerId: number; whiteCards: WhiteCard[] };

type Storage = {
  config: LiveObject<Config>;
  // Mapping of playerId to list of white cards in player's hand
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

import create from "zustand";

export const useGame = create((set) => ({
  hand: [],
  whiteDeck: [],
  backDeck: [],
  drawWhite: () => {},
  drawBlack: () => {},
  discardWhite: () => {},
  discardBlack: () => {},
}));

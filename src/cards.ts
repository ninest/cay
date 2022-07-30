import cards from "./cards.json";

export const whiteCardsCAH = cards.white.slice(0, 25);
export const blackCardsCAH = cards.black
  .filter((black) => black.pick == 2)
  .slice(0, 25);

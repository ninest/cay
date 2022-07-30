export type WhiteCard = { text: string; pack: number };
export type BlackCard = WhiteCard & { pick: number };
export interface CardPack {
  name: string;
  white: WhiteCard[];
  black: BlackCard[];
  official: boolean;
}

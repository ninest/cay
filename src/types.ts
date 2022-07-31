export type WhiteCard = { text: string; pack: number };
export type BlackCard = WhiteCard & { pick: number };
export interface CardPack {
  name: string;
  white: WhiteCard[];
  black: BlackCard[];
  official: boolean;
}

const sizes = [
  "1",
  "xs",
  "sm",
  "base",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
] as const;
export type Size = typeof sizes[number];

import defaultPack from "../packs/default.json";
import worldWideWeb from "../packs/www.json";
import { CardPack } from "./types";

export const packs: CardPack[] = [
  { ...defaultPack, name: "Base" },
  { ...worldWideWeb, name: "World-wide-web" },
  {
    name: "Test",
    white: [
      { pack: 0, text: "W0" },
      { pack: 0, text: "W1" },
      { pack: 0, text: "W2" },
      { pack: 0, text: "W3" },
      { pack: 0, text: "W4" },
      { pack: 0, text: "W5" },
      { pack: 0, text: "W6" },
      { pack: 0, text: "W7" },
      { pack: 0, text: "W8" },
      { pack: 0, text: "W9" },
      { pack: 0, text: "WA" },
      { pack: 0, text: "WB" },
      { pack: 0, text: "WC" },
    ],
    black: [
      { pack: 0, text: "B0 _", pick: 1 },
      { pack: 0, text: "B1 _", pick: 1 },
      { pack: 0, text: "B2 _", pick: 1 },
      { pack: 0, text: "B3 _", pick: 1 },
      { pack: 0, text: "B4 _", pick: 1 },
      { pack: 0, text: "B5 _ and _?", pick: 2 },
      { pack: 0, text: "B6 _", pick: 1 },
      { pack: 0, text: "B7 _", pick: 1 },
      { pack: 0, text: "B8 _", pick: 1 },
      { pack: 0, text: "B9 _", pick: 1 },
    ],
    official: false,
  },
];

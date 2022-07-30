import defaultPack from "../packs/default.json";
import worldWideWeb from "../packs/www.json";
import { CardPack } from "./types";

export const packs: CardPack[] = [
  { ...defaultPack, name: "Base" },
  { ...worldWideWeb, name: "World-wide-web" },
];

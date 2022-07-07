import { BlackCard, WhiteCard } from "@/liveblocks";
import clsx from "clsx";
import { HTMLAttributes } from "react";

type WhiteCardProps = WhiteCard & HTMLAttributes<HTMLButtonElement>;

export const White = (whiteCard: WhiteCardProps) => {
  return (
    <button
      className={clsx(
        "block bg-white p-base rounded-lg shadow",
        whiteCard.className
      )}
    >
      <p className="text-gray-700 font-bold text-lg">{whiteCard.text}</p>
    </button>
  );
};

type BlackCardProps = BlackCard & HTMLAttributes<HTMLDivElement>;
export const Black = (blackCard: BlackCardProps) => {
  return (
    <div
      className={clsx("bg-black p-base rounded-lg shadow", blackCard.className)}
    >
      <p className="text-white font-black text-lg">{blackCard.text}</p>
    </div>
  );
};

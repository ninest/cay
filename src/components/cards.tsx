import { BlackCard, WhiteCard } from "@/types";
import clsx from "clsx";
import { HTMLAttributes } from "react";

interface WhiteCardProps extends HTMLAttributes<HTMLButtonElement> {
  whiteCard: WhiteCard;
  selected?: boolean;
}

export const White = ({
  whiteCard,
  selected = false,
  ...props
}: WhiteCardProps) => {
  return (
    <button
      {...props}
      className={clsx(
        "flex p-md rounded-lg shadow",
        "aspect-[3/4]",
        { "bg-white": !selected, "bg-primary-50": selected },
        props.className
      )}
    >
      <p className="text-gray-700 font-bold text-sm text-left">
        {whiteCard.text}
      </p>
    </button>
  );
};

type BlackCardProps = BlackCard & HTMLAttributes<HTMLDivElement>;
export const Black = (blackCard: BlackCardProps) => {
  return (
    <div
      className={clsx(
        "bg-black p-base rounded-lg shadow",
        "aspect-[3/4]",
        blackCard.className
      )}
    >
      <p className="text-white font-black text-lg">{blackCard.text}</p>
    </div>
  );
};

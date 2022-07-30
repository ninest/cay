import { packs } from "@/cards";
import { CardPack } from "@/types";
import clsx from "clsx";

interface PackSelectionProps {
  selectedPacks: CardPack[];
  setSelectedPacks: (cardPacks: CardPack[]) => void;
}

export const PackSelection = ({
  selectedPacks,
  setSelectedPacks,
}: PackSelectionProps) => {
  return (
    <div className="flex -mt-sm">
      {packs.map((pack) => {
        const packSelected = selectedPacks.find((p) => p.name === pack.name);
        return (
          <button
            key={pack.name}
            onClick={() => {
              console.log();
              if (packSelected) {
                console.log("Remove pack");
                console.log(pack.name);

                setSelectedPacks(
                  selectedPacks.filter((p) => p.name !== pack.name)
                );
              } else {
                console.log("add pack");
                setSelectedPacks([...selectedPacks, pack]);
              }
            }}
            className={clsx(
              "mt-sm mr-sm",
              "border-2 px-sm py-xs font-medium rounded-xl",
              {
                "border-gray-200": !packSelected,
                "border-primary": packSelected,
              }
            )}
          >
            {pack.name}
          </button>
        );
      })}
    </div>
  );
};

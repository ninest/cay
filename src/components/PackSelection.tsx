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
    <div className="flex flex-col space-y-sm">
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
              "flex items-center justify-between border-2 px-sm py-1 font-medium rounded-xl",
              {
                "border-gray-200": !packSelected,
                "border-primary": packSelected,
              }
            )}
          >
            <div className="text-sm">{pack.name}</div>
            <div className="flex flex-col items-end text-xs text-gray-light">
              <div>
                <span className="font-mono">{pack.black.length}</span> black
              </div>
              <div>
                <span className="font-mono">{pack.white.length}</span> white
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

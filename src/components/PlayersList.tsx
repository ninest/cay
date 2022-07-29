import { Presence } from "@/liveblocks";
import { HTMLAttributes } from "react";
import { IconType } from "react-icons";
import { FaChevronRight, FaCrown } from "react-icons/fa";
import { Icon } from "./Icon";

export interface Player {
  connectionId: number;
  presence: Presence;
  // Optional icon to keep at the right of the player
  icons?: IconType[];
  score?: number;
}
interface PlayersListProps extends HTMLAttributes<HTMLDivElement> {
  leaderId: number;
  players: Player[];
}
export const PlayersList = ({ leaderId, players }: PlayersListProps) => {
  return (
    <ul className="space-y-xs">
      {players.map((player, index) => (
        <PlayerListItem
          key={player.connectionId}
          player={player}
          score={player.score}
          isLeader={player.connectionId == leaderId}
          icons={player.icons}
        />
      ))}
    </ul>
  );
};

interface PlayerListItemsProps {
  player: Player;
  isLeader: boolean;
  score?: number;
  icons?: IconType[];
}
const PlayerListItem = ({
  player,
  isLeader,
  score,
  icons,
}: PlayerListItemsProps) => {
  return (
    <li key={player.connectionId} className="flex items-center justify-between">
      <div className="flex items-center space-x-xs">
        <Icon icon={FaChevronRight} className="text-sm text-gray-lighter" />
        <span>
          {player?.presence?.name}
          {((player?.presence?.name as string) ?? "").trim() == "" && (
            <span className="italic">No name</span>
          )}
        </span>
      </div>

      <div className="flex items-center space-x-sm">
        {score && <div className="font-mono">{score}</div>}
        {(icons || isLeader) && (
          <div className="ml-sm flex items-center space-x-xs">
            {isLeader && <Icon icon={FaCrown} className="text-yellow-500" />}
            {icons &&
              icons.map((icon, index) => <Icon key={index} icon={icon} />)}
          </div>
        )}
      </div>
    </li>
  );
};

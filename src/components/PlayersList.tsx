import { Presence } from "@/liveblocks";
import { HTMLAttributes } from "react";
import { FaChevronRight, FaCrown } from "react-icons/fa";
import { Icon } from "./Icon";

interface Player {
  connectionId: number;
  presence: Presence;
}
interface PlayersListProps extends HTMLAttributes<HTMLDivElement> {
  leaderId: number;
  players: Player[];
}
export const PlayersList = ({ leaderId, players }: PlayersListProps) => {
  return (
    <ul className="space-y-xs">
      {players.map((player) => (
        <PlayerListItem
          player={player}
          isLeader={player.connectionId == leaderId}
        />
      ))}
    </ul>
  );
};

const PlayerListItem = ({
  player,
  isLeader,
}: {
  player: Player;
  isLeader: boolean;
}) => {
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

      {isLeader && (
        <div className="ml-sm">
          <Icon icon={FaCrown} className="text-yellow-500" />
        </div>
      )}
    </li>
  );
};

import { FaCrown } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { Icon } from "./Icon";

interface HeaderProps {
  text: string;
  score: number;
  isLeader?: boolean;
  icons: IconType[];
}

export const Header = ({
  icons,
  text,
  isLeader = false,
  score,
}: HeaderProps) => {
  return (
    <div className="sticky top-0">
    <header className="bg-white p-base border-b flex items-center justify-between">
      <div>{text}</div>
      <div className="flex items-center space-x-sm">
        <div className="font-mono">{score}</div>
        {(icons || isLeader) && (
          <div className="flex items-center space-x-xs">
            {isLeader && <Icon icon={FaCrown} className="text-yellow-500" />}
            {icons &&
              icons.map((icon, index) => <Icon key={index} icon={icon} />)}
          </div>
        )}
      </div>
    </header>
    </div>  );
};

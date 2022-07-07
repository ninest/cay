import { Button } from "@/components/Button";
import { FormLabel } from "@/components/form/FormLabel";
import { Icon } from "@/components/Icon";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Spacer } from "@/components/Spacer";
import { client } from "@/liveblocks";
import { dedup } from "@/utils/dedup";
import { fakePlayerName } from "@/utils/names";
import { shareLink } from "@/utils/share";
import { useEffect, useState } from "react";
import { FaChevronRight, FaShareAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

export const StartPage = () => {
  const navigate = useNavigate();

  let { roomId } = useParams();
  if (!roomId) roomId = "cool-room";

  const [connectionId, setConnectionId] = useState<null | number>();

  return (
    <PageLayout className="flex">
      <div className="h-full md:w-2/3 lg:w-1/4 flex flex-col">
        <pre>
          {JSON.stringify(
            {
              roomId,
            },
            null,
            2
          )}
        </pre>
        <div>
          <span className="bg-gray-100 border rounded p-0.5 text-xs font-mono">
            {roomId}
          </span>
        </div>
        <Spacer size="xs" />
        <h1 className="font-black text-3xl">New game</h1>
        <Spacer />

        <Button
          iconLeft={FaShareAlt}
          onClick={() => shareLink(document.location.href)}
        >
          Share join link
        </Button>

        <Spacer />

        <fieldset>
          <FormLabel name="name">My name: </FormLabel>
          <Spacer size="xs" />
          <input
            className="form-input w-full"
            name="name"
            type="text"
            // value={name ?? ""}
            // onChange={(e) => nameChange(e.target.value)}
          />
        </fieldset>

        <Spacer />

        <div>
          <div className="font-semibold text-gray-darker">Players:</div>
          <Spacer size="xs" />
          {/* {others.length > 0 ? (
            <ul className="space-y-xs">
              {others.map((other: any) => (
                <li
                  key={other.connectionId}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-xs">
                    <Icon
                      icon={FaChevronRight}
                      className="text-sm text-gray-lighter"
                    />
                    <span>
                      {other?.presence?.name}
                      {((other?.presence?.name as string) ?? "").trim() ==
                        "" && <span className="italic">No name</span>}
                    </span>
                  </div>

                  {other?.presence?.started && (
                    <div className="font-mono text-xs p-1 bg-gray-100 border rounded">
                      Ready
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="border-2 border-dashed flex items-center justify-center py-3xl rounded-md font-medium text-gray-light">
              You have no friends.
            </div>
          )} */}
        </div>

        <Spacer />

        <div className="mt-auto">
          {/* {gameStarted ? (
            <div onClick={reset}>The game has already started!</div>
          ) : (
            <span onClick={reset} className="text-sm">
              The game will start when everyone presses "Start".
              {alreadyRequestedStart && <span> You've already clicked.</span>}
            </span>
          )} */}
          <Spacer />
          <Button
            variant="primary"
            // disabled={alreadyRequestedStart}
            className="w-full"
            // onClick={startGame}
          >
            {/* Start ({dedup(playersStarted).length} / {others.length + 1}) */}
            Start
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

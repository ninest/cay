import { faker } from "@faker-js/faker";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { Button } from "../components/Button";
import { FormLabel } from "../components/form/FormLabel";
import { Icon } from "../components/Icon";
import { PageLayout } from "../components/layouts/PageLayout";
import { Spacer } from "../components/Spacer";
import { client } from "../liveblocks";
import { useStore } from "../state/game";

export const IndexPage = () => {
  const {
    liveblocks: { enterRoom, leaveRoom, others, connection },
    name,
    setName,
    playersStarted,
    requestStart,
    gameStarted,
    setGameStarted,
    reset,
  } = useStore();

  const roomId = "one";
  const [connectionId, setConnectionId] = useState<null | number>();

  useEffect(() => {
    enterRoom(roomId, { playersStarted: [], gameStarted: false });

    // Set initial name
    setName(faker.animal.cat());

    return () => {
      leaveRoom(roomId);
    };
  }, [enterRoom, leaveRoom]);

  useEffect(() => {
    if (connection == "open") {
      const room = client.getRoom(roomId);
      const self = room?.getSelf();
      setConnectionId(self?.connectionId);
    }
  }, [connection]);

  const nameChange = (name: string) => {
    setName(name);
  };

  const alreadyRequestedStart = connectionId
    ? playersStarted.includes(connectionId)
    : false;

  const startGame = () => {
    if (connectionId) {
      requestStart(connectionId);
    }
  };

  useEffect(() => {
    if (
      connection == "open" &&
      playersStarted.length == others.length + 1 &&
      others.length > 0
    ) {
      setGameStarted(true);
      alert("The game has started");
    }
  }, [playersStarted]);

  return (
    <PageLayout className="flex">
      <div className="h-full md:w-1/3 lg:w-1/4 flex flex-col">
        {/* <pre>{JSON.stringify({ connectionId }, null, 2)}</pre> */}
        <h1 className="font-black text-3xl">
          Room{" "}
          <span className="font-mono bg-gray-50 border-gray-100 rounded">
            {roomId}
          </span>
        </h1>
        <Spacer />
        <fieldset>
          <FormLabel name="name">My name: </FormLabel>
          <Spacer size="xs" />
          <input
            className="form-input w-full"
            name="name"
            type="text"
            value={name ?? ""}
            onChange={(e) => nameChange(e.target.value)}
          />
        </fieldset>

        <Spacer />

        <div>
          <div className="font-semibold text-gray-darker">Players:</div>
          <Spacer size="xs" />
          {others.length > 0 ? (
            <ul className="space-y-xs">
              {others.map((other) => (
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
            <div className="border-2 border-dashed flex items-center justify-center p-md rounded-md font-medium">
              You have no friends.
            </div>
          )}
        </div>

        <Spacer />

        <div className="mt-auto">
          <span className="text-sm" onClick={reset}>
            The game will start when everyone presses "Start".
            {alreadyRequestedStart && <span> You've already clicked.</span>}
          </span>
          <Spacer />
          <Button
            variant="primary"
            disabled={alreadyRequestedStart}
            className="w-full"
            onClick={startGame}
          >
            Start ({playersStarted.length} / {others.length + 1})
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

import { Button } from "@/components/Button";
import { Debug } from "@/components/Debug";
import { FormLabel } from "@/components/form/FormLabel";
import { PageLayout } from "@/components/layouts/PageLayout";
import { PlayersList } from "@/components/PlayersList";
import { Spacer } from "@/components/Spacer";
import {
  useList,
  useMyPresence,
  useOthers,
  useRoom,
  useSelf,
} from "@/liveblocks";
import { fakePlayerName } from "@/utils/names";
import { shareLink } from "@/utils/share";
import { useEffect } from "react";
import { FaShareAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const StarPage = () => {
  const navigate = useNavigate();
  const room = useRoom();

  const [presence, updatePresence] = useMyPresence();

  if (!presence.name) {
    updatePresence({ name: fakePlayerName() });
  }

  const others = useOthers();

  const currentUser = useSelf();

  const config = useList("config");
  const whiteCards = useList("whiteCards");
  const blackCards = useList("blackCards");

  // If this user is the first one, set them to the leader and first black card reader
  useEffect(() => {
    if (!config?.get("leader") || !config?.get("reader")) {
      config?.update({
        leader: currentUser?.connectionId,
        reader: currentUser?.connectionId,
      });
    }
    console.log(config?.toObject());
  }, [config]);

  useEffect(() => {
    if (config?.get("started")) navigate(`/${room.id}/game`);
  }, [config]);

  if (config == null) {
    return <div>Loading ...</div>;
  }

  const leaderId = config.get("leader");
  const isLeader = currentUser?.connectionId == leaderId;

  const startGame = () => {
    config.set("started", true);
  };

  return (
    <PageLayout className="flex">
      <div className="h-full w-full md:w-2/3 lg:w-1/4 flex flex-col">
        <Debug
          wrapperClassName="mb-base"
          data={{
            room,
            currentUser,
            others: others.toArray(),
            config: config?.toObject(),
          }}
        />
        <div>
          <span className="bg-gray-100 border rounded p-0.5 text-xs font-mono">
            {room.id}
          </span>
        </div>
        <Spacer size="xs" />
        <h1 className="font-black text-3xl">New game</h1>

        <div className="my-base">
          <Button
            iconLeft={FaShareAlt}
            className="w-full"
            onClick={() => shareLink(document.location.href)}
          >
            Share join link
          </Button>
        </div>

        <fieldset>
          <FormLabel name="name">My name: </FormLabel>
          <Spacer size="xs" />
          <input
            className="form-input w-full"
            name="name"
            type="text"
            value={presence.name ?? ""}
            onChange={(e) =>
              updatePresence({
                name: e.target.value,
              })
            }
          />
          {isLeader && (
            <>
              <Spacer />
              <p>You are the leader</p>
            </>
          )}
        </fieldset>

        <Spacer />

        <div>
          <Spacer />
          <div className="font-semibold text-gray-darker">
            Players <span className="font-mono">({others.count})</span>:
          </div>
          <Spacer size="xs" />
          {others.count > 0 ? (
            <PlayersList
              leaderId={leaderId}
              players={others.map((other) => ({
                connectionId: other.connectionId,
                presence: other.presence!,
              }))}
            />
          ) : (
            <div className="border-2 border-dashed flex items-center justify-center py-3xl rounded-md font-medium text-gray-light">
              You have no friends.
            </div>
          )}
        </div>

        <Spacer />

        <div className="mt-auto">
          <Spacer />
          {isLeader ? (
            <>
              <Button variant="primary" className="w-full" onClick={startGame}>
                Start
              </Button>
            </>
          ) : (
            <>
              <i>Waiting for the host to start the game ...</i>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
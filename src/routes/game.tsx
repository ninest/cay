import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/Button";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Debug } from "@/components/Debug";
import { useList, useOthers, useRoom, useSelf } from "@/liveblocks";
import { sample } from "@/utils/random";

export const GamePage = () => {
  const navigate = useNavigate();
  const room = useRoom();
  const others = useOthers();
  const currentUser = useSelf();
  const config = useList("config");
  const whiteCards = useList("whiteCards");
  const blackCards = useList("blackCards");

  if (config == null) {
    return <div>Loading ...</div>;
  }

  const leaderId = config.get("leader");
  const isLeader = currentUser?.connectionId == leaderId;

  const round = () => {
    const connectionIds = [
      currentUser?.connectionId!,
      ...others.map((other) => other.connectionId!),
    ];

    // Set the black card reader
    config.set("reader", sample(connectionIds));
  };

  const reader = config.get("reader");
  let readerInfo;
  if (reader == currentUser?.connectionId) {
    readerInfo = currentUser;
  } else {
    readerInfo = others.toArray().find((other) => other.connectionId == reader);
  }
  const isReader = reader == currentUser?.connectionId;

  return (
    <PageLayout className="flex">
      <div className="flex flex-col space-y-base">
        <Debug data={{ room, currentUser, others:others.toArray(), readerInfo }} />

        <div>
          <Button onClick={round} className="w-full">
            Round
          </Button>
        </div>

        {isReader ? (
          <div>
            You are the <span className="font-black">black card</span> reader.
          </div>
        ) : (
          <div>
            <i>{readerInfo?.presence?.name}</i> is the <span className="font-black">black card</span> reader.
          </div>
        )}
      </div>
    </PageLayout>
  );
};

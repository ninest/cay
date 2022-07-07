import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/Button";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Debug } from "@/components/Debug";
import {
  useList,
  useMap,
  useOthers,
  useRoom,
  useSelf,
  WhiteCard,
} from "@/liveblocks";
import { randomIndex, sample } from "@/utils/random";
import { blackCardsCAH, whiteCardsCAH } from "@/cards";
import { useState } from "react";
import { Black, White } from "@/components/cards";

export const GamePage = () => {
  const navigate = useNavigate();
  const room = useRoom();
  const others = useOthers();
  const currentUser = useSelf();
  const config = useList("config");
  const whiteCards = useList("whiteCards");
  const blackCards = useList("blackCards");
  const hands = useMap("hands");

  if (
    config == null ||
    whiteCards == null ||
    blackCards == null ||
    hands == null ||
    currentUser == null
  ) {
    return <div>Loading ...</div>;
  }

  const leaderId = config.get("leader");
  const isLeader = currentUser.connectionId == leaderId;

  const connectionIds = [
    currentUser?.connectionId!,
    ...others.map((other) => other.connectionId!),
  ];

  // Set the next black card reader
  const nextReader = () => {
    config.set("reader", sample(connectionIds));
  };

  const round = () => {
    // Distribute cards
    for (let i = 0; i < 3; i++) {
      connectionIds.forEach((connectionId) => {
        if (connectionId != leaderId) {
          try {
            hands.set(connectionId.toString(), [
              ...hands.get(connectionId.toString())!,
              whiteCards.get(0)!,
            ]);
          } catch (e) {
            hands.set(connectionId.toString(), [whiteCards.get(0)!]);
          }
          whiteCards.delete(0);
        }
      });
    }

    // Set black card
    config.set("currentBlackCard", randomIndex(blackCards.toArray()));
  };

  const reader = config.get("reader");
  let readerInfo;
  if (reader == currentUser?.connectionId) {
    readerInfo = currentUser;
  } else {
    readerInfo = others.toArray().find((other) => other.connectionId == reader);
  }
  const isReader = reader == currentUser?.connectionId;

  const myHand = hands.get(currentUser.connectionId.toString())!;

  const blackCard = blackCards.get(config.get("currentBlackCard") ?? 0);

  return (
    <PageLayout className="flex flex-col space-y-base lg:space-y-0 lg:flex-row lg:space-x-lg">
      <div className="md:w-2/3 lg:w-1/4 space-y-base">
        <Debug
          data={{
            room,
            currentUser,
            others: others.toArray(),
            readerInfo,
            hands: {
              keys: Array.from(hands.keys()),
              values: Array.from(hands.values()),
            },
            myHand,
            whiteCards: whiteCards.toArray(),
            blackCards: blackCards.toArray(),
          }}
        />

        <div>
          {isReader && (
            <Button onClick={round} className="w-full">
              Round
            </Button>
          )}
        </div>

        {isReader ? (
          <div>
            You are the <span className="font-black">black card</span> reader.
          </div>
        ) : (
          <div>
            <i>{readerInfo?.presence?.name}</i> is the{" "}
            <span className="font-black">black card</span> reader.
          </div>
        )}

        {config.get("currentBlackCard") == null ? (
          <>
            <div>
              <i>The black card hasn't been chosen yet ...</i>
            </div>
          </>
        ) : (
          <>
            <div>
              <Black {...blackCard!} className="h-60 md:h-72" />
            </div>
          </>
        )}
      </div>

      <div>
        {isReader ? (
          <></>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-base">
              {myHand &&
                myHand.map((whiteCard, index) => (
                  <White key={index} {...whiteCard} className="h-60 md:h-72" />
                ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};

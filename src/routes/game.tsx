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
import clsx from "clsx";
import { Spacer } from "@/components/Spacer";

export const GamePage = () => {
  const navigate = useNavigate();
  const room = useRoom();
  const others = useOthers();
  const currentUser = useSelf();
  const config = useList("config");
  const whiteCards = useList("whiteCards");
  const blackCards = useList("blackCards");
  const hands = useMap("hands");
  const submittedWhiteCards = useList("submittedWhiteCards");

  const leaderId = config?.get("leader");
  const isLeader = currentUser?.connectionId == leaderId;

  const connectionIds = [
    currentUser?.connectionId!,
    ...others.map((other) => other.connectionId!),
  ];

  // Set the next black card reader
  const nextReader = () => {
    config?.set("reader", sample(connectionIds));
  };

  const round = () => {
    // Distribute cards
    for (let i = 0; i < 3; i++) {
      connectionIds.forEach((connectionId) => {
        if (connectionId != leaderId) {
          try {
            hands?.set(connectionId.toString(), [
              ...hands?.get(connectionId.toString())!,
              whiteCards?.get(0)!,
            ]);
          } catch (e) {
            hands?.set(connectionId.toString(), [whiteCards?.get(0)!]);
          }
          whiteCards?.delete(0);
        }
      });
    }

    // Set black card
    config?.set("currentBlackCard", randomIndex(blackCards?.toArray() ?? []));

    // Allow users to submit
    setSubmitted(false);

    // Reset selected
    setSelectedWhiteCards([]);
  };

  const reader = config?.get("reader");
  let readerInfo;
  if (reader == currentUser?.connectionId) {
    readerInfo = currentUser;
  } else {
    readerInfo = others.toArray().find((other) => other.connectionId == reader);
  }
  const isReader = reader == currentUser?.connectionId;

  const myHand = hands?.get(currentUser?.connectionId.toString()!);

  const blackCard = blackCards?.get(config?.get("currentBlackCard") ?? 0);
  const maxSelection = blackCard?.pick!;

  const [selectedWhiteCards, setSelectedWhiteCards] = useState<WhiteCard[]>([]);
  const selectWhiteCard = (whiteCard: WhiteCard) => {
    if (submitted) return;

    console.log(whiteCard);
    if (selectedWhiteCardsContains(whiteCard)) {
      setSelectedWhiteCards(
        selectedWhiteCards.filter((card) => card.text !== whiteCard.text)
      );
    } else {
      setSelectedWhiteCards([...selectedWhiteCards, whiteCard]);
    }
  };
  const selectedWhiteCardsContains = (whiteCard: WhiteCard) => {
    return selectedWhiteCards.some((card) => card.text === whiteCard.text);
  };
  const tooManySelected = selectedWhiteCards.length > maxSelection;

  const [submitted, setSubmitted] = useState(false);
  const submitWhiteCards = () => {
    if (tooManySelected) return;

    submittedWhiteCards?.push({
      playerId: currentUser?.connectionId!,
      whiteCards: selectedWhiteCards,
    });

    // Remove those cards from hand
    selectedWhiteCards.forEach((whiteCard) => {
      const previousCards = hands?.get(currentUser?.connectionId.toString()!);
      hands?.set(
        currentUser?.connectionId.toString()!,
        previousCards?.filter((card) => card.text !== whiteCard.text)!
      );
    });

    setSelectedWhiteCards([]);
    setSubmitted(true);
  };

  // For reader
  const allSubmitted = submittedWhiteCards?.length === others.count;

  if (
    config == null ||
    whiteCards == null ||
    blackCards == null ||
    hands == null ||
    currentUser == null ||
    submittedWhiteCards == null
  ) {
    return <div>Loading ...</div>;
  }

  return (
    <PageLayout className="flex flex-col space-y-base lg:space-y-0 lg:flex-row lg:space-x-lg">
      <div className="md:w-2/3 lg:w-1/4 space-y-base">
        <Debug
          data={{
            submittedWhiteCards: submittedWhiteCards.toArray(),
            allSubmitted,
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
              <Black {...blackCard!} className="w-1/2 md:w-1/3 lg:w-full" />
            </div>
          </>
        )}
      </div>

      <div>
        {isReader ? (
          <>
            {allSubmitted ? (
              <>
                <p className="font-bold text-lg">Choose the best response:</p>
                <Spacer />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-base">
                  {submittedWhiteCards.map((submittedWhiteCards, index) => (
                    <div key={index}>
                      {submittedWhiteCards.whiteCards.map(
                        (whiteCard, index) => (
                          <White
                            key={index}
                            whiteCard={whiteCard}
                            onClick={() => {}}
                          />
                        )
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {config.get("currentBlackCard") != null && (
                  <p>Waiting for your slow friends ...</p>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-base">
              {myHand &&
                myHand.map((whiteCard, index) => (
                  <White
                    key={index}
                    whiteCard={whiteCard}
                    selected={selectedWhiteCardsContains(whiteCard)}
                    onClick={() => selectWhiteCard(whiteCard)}
                  />
                ))}
            </div>
          </>
        )}
      </div>

      {selectedWhiteCards.length > 0 && (
        <div className="fixed  bottom-0 left-0 right-0">
          <div className="bg-white p-base border-t flex items-center justify-between">
            <div>
              <span
                className={clsx("font-semibold", {
                  "text-error": tooManySelected,
                })}
              >
                <span className="font-mono">{selectedWhiteCards.length}</span>{" "}
                cards selected
              </span>
              {tooManySelected && (
                <span className="text-gray-light">
                  {" "}
                  (max <span className="font-mono">{maxSelection}</span>)
                </span>
              )}
            </div>
            <Button
              variant="primary"
              disabled={tooManySelected}
              onClick={submitWhiteCards}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

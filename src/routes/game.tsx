import { useNavigate } from "react-router-dom";

import { Button } from "@/components/Button";
import { Black, White } from "@/components/cards";
import { Debug } from "@/components/Debug";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Player, PlayersList } from "@/components/PlayersList";
import { Spacer } from "@/components/Spacer";
import {
  useList,
  useMap,
  useOthers,
  useRoom,
  useSelf,
  WhiteCard,
} from "@/liveblocks";
import { randomIndex, sample } from "@/utils/random";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { FaCheck } from "react-icons/fa";

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
  const scores = useMap("scores");

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

  useEffect(() => {
    // Stop the game if there are no players
    if (others.toArray().length === 0) {
      alert("There are no players in this game!");
    }
  }, [others]);

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

  const selectWhiteCardSet = (playerId: number) => {
    // Add 1 to this player's score and reset the black card on table
    const key = playerId.toString();
    const currentPlayerScore = scores?.get(key) ?? 0;
    scores?.set(key, currentPlayerScore + 1);
  };

  if (
    config == null ||
    whiteCards == null ||
    blackCards == null ||
    hands == null ||
    currentUser == null ||
    submittedWhiteCards == null ||
    scores == null
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
            Click "round" to start the round.
          </div>
        ) : (
          <div>
            <i>{readerInfo?.presence?.name}</i> is the{" "}
            <span className="font-black">black card</span> reader.
          </div>
        )}

        {config.get("currentBlackCard") == null ? (
          <>
            <EmptyPlaceholder>
              The black card hasn't been chosen yet
            </EmptyPlaceholder>
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
                <div className="grid grid-cols-1 gap-base">
                  {submittedWhiteCards.map((submittedWhiteCardSets, index) => (
                    <div key={index} className="flex items-center space-x-sm">
                      {submittedWhiteCardSets.whiteCards.map(
                        (whiteCard, index) => (
                          <White
                            key={index}
                            whiteCard={whiteCard}
                            className="w-1/2"
                            onClick={() =>
                              selectWhiteCardSet(
                                submittedWhiteCardSets.playerId
                              )
                            }
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
                  <EmptyPlaceholder>
                    Waiting for your slow friends to submit white cards
                  </EmptyPlaceholder>
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

      <PlayersList
        leaderId={leaderId!}
        players={others.map((other) => {
          const icons: IconType[] = [];
          // Insert check mark if user has submitted white card
          if (
            submittedWhiteCards
              .toArray()
              .some((s) => s.playerId === other.connectionId)
          )
            icons.push(FaCheck);

          const score = scores?.get(other.connectionId.toString());

          return {
            connectionId: other.connectionId,
            presence: other.presence!,
            score,
            icons,
          } as Player;
        })}
      />

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

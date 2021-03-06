import { Button } from "@/components/Button";
import { Black, White } from "@/components/cards";
import { Debug } from "@/components/Debug";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { Header } from "@/components/Header";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Player, PlayersList } from "@/components/PlayersList";
import { Spacer } from "@/components/Spacer";
import {
  SubmittedWhiteCards,
  useList,
  useMap,
  useOthers,
  useRoom,
  useSelf
} from "@/liveblocks";
import { WhiteCard } from "@/types";
import { randomIndex, sample } from "@/utils/random";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { FaCheck, FaSquare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

  const otherConnectionsIds = others.map((other) => other.connectionId!);
  const allConnectionIds = [currentUser?.connectionId!, ...otherConnectionsIds];

  const firstRoundStarted = config?.get("gameStarted");

  // Stop the game if there are no players
  useEffect(() => {
    if (others.toArray().length === 0) {
      alert("There are no players in this game!");
    }
  }, [others]);

  // Reader: the black card reader
  const reader = config?.get("reader");
  let readerInfo;
  if (reader == currentUser?.connectionId) {
    readerInfo = currentUser;
  } else {
    readerInfo = others.toArray().find((other) => other.connectionId == reader);
  }
  const isReader = reader == currentUser?.connectionId;

  // Current black card
  const blackCard = blackCards?.get(config?.get("currentBlackCard") ?? 0);
  const maxSelection = blackCard?.pick!; // the number of white cards to select

  // Set the next black card reader
  const nextReader = () => {
    config?.set("reader", sample(otherConnectionsIds));
  };

  const round = () => {
    distributeWhiteCards();

    // Set black card
    config?.set("currentBlackCard", randomIndex(blackCards?.toArray() ?? []));

    // Reset selected
    setSelectedWhiteCards([]);

    // Set the gameStarted to true (this actually only needs to be done for the first round)
    config?.set("gameStarted", true);
  };

  // Ensure that all players (except for the leader have three white cards)
  // This should happen at the end of the black reader's round, so they should not be getting white cards
  // All players (including the black card reader) should get white cards
  const distributeWhiteCards = () => {
    for (const playerId of allConnectionIds) {
      while (true) {
        const key = playerId.toString();
        const playersHand = hands?.get(key) ?? [];

        if (playersHand.length >= 3) {
          break;
        } else {
          const newWhiteCard = whiteCards?.get(0);
          whiteCards?.delete(0);
          hands?.set(key, [newWhiteCard!, ...playersHand]);
        }
      }
    }
  };

  // Reset all submitted white cards
  const resetTable = () => {
    submittedWhiteCards?.clear();
  };

  const myHand = hands?.get(currentUser?.connectionId.toString()!);
  // Have I submitted the white cards?
  const haveSubmitted = submittedWhiteCards?.some(
    (submittedWhiteCardSet) =>
      submittedWhiteCardSet.playerId === currentUser?.connectionId
  );

  const [selectedWhiteCards, setSelectedWhiteCards] = useState<WhiteCard[]>([]);
  const selectWhiteCard = (whiteCard: WhiteCard) => {
    if (haveSubmitted) return;

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
  const notEnoughSelected = selectedWhiteCards.length !== maxSelection;

  const submitWhiteCards = () => {
    if (notEnoughSelected) return;

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
    // setSubmitted(true);
  };

  // For reader
  const allSubmitted = submittedWhiteCards?.length === others.count;

  const [selectedWhiteCardSet, setSelectedWhiteCardSet] =
    useState<SubmittedWhiteCards | null>(null);
  const [roundWinnerName, setRoundWinnerName] = useState<string | null>("");

  const selectWhiteCardSet = (playerId: number) => {
    // const submittedWhiteCardSet = submittedWhiteCards?.get(playerId)!;
    const submittedWhiteCardSet = submittedWhiteCards
      ?.toArray()
      .find((whiteCardSet) => whiteCardSet.playerId === playerId);
    setSelectedWhiteCardSet(submittedWhiteCardSet!);
  };

  const confirmWhiteCardSet = () => {
    const playerId = selectedWhiteCardSet?.playerId!;
    //  Add 1 to this player's score and set the round winner name
    const key = playerId.toString();
    const currentPlayerScore = scores?.get(key) ?? 0;
    scores?.set(key, currentPlayerScore + 1);
    setRoundWinnerName(
      others.toArray().find((other) => other.connectionId === playerId)
        ?.presence?.name!
    );
  };

  const readerFinishRound = () => {
    // reset selected white cards and winner name so bottom bar goes away
    setSelectedWhiteCardSet(null);
    setRoundWinnerName(null);
    reset();
  };

  const reset = () => {
    resetTable();
    round();

    // The next reader is chosen the last because the new white cards must be distributed by the current black card reader
    nextReader();
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

  const headerIcons: IconType[] = [];
  if (isReader) headerIcons.push(FaSquare);
  return (
    <>
      <Header
        text={currentUser.presence?.name!}
        score={scores.get(currentUser.connectionId.toString()) ?? 0}
        isLeader={isLeader}
        icons={headerIcons}
      />
      <PageLayout className="flex flex-col space-y-base lg:space-y-0 lg:flex-row lg:space-x-lg">
        <div className="md:w-2/3 lg:w-1/4 space-y-base">
          {!firstRoundStarted && isReader && (
            <div>
              <Button onClick={round} variant="primary" className="w-full">
                Start game
              </Button>
            </div>
          )}

          {isReader ? (
            <div>
              <span className="text-primary font-medium">You</span> are the{" "}
              <span className="font-black">black card</span> reader.
              {!firstRoundStarted && (
                <span> Click "start" to start the round.</span>
              )}
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
              <div className="grid grid-cols-2 gap-base">
                <Black {...blackCard!} className="" />

                {/* For the reader, show the selected white card set they currently selected */}
                {isReader && selectedWhiteCardSet && (
                  <>
                    {selectedWhiteCardSet.whiteCards.map((whiteCard, index) => (
                      <White key={index} whiteCard={whiteCard} />
                    ))}
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <div>
          {isReader ? (
            <>
              {/* All players have submitted white cards, so reader can see them */}
              {allSubmitted ? (
                <>
                  <p className="font-bold text-lg">Choose the best response:</p>
                  <Spacer />
                  <div className="grid grid-cols-1 gap-base">
                    {submittedWhiteCards.map(
                      (submittedWhiteCardSets, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-sm"
                        >
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
                      )
                    )}
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

        <Spacer size="3xl" />
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
      </PageLayout>
      {/* 
          selectedWhiteCards.length > 0 : white card selector has selected some cards
          selectedWhiteCardSet : black card reader has selected a card set and needs to confirm
          roundWinnerName : black card selector has selected a winner
        */}
      {(selectedWhiteCards.length > 0 ||
        selectedWhiteCardSet ||
        roundWinnerName) && (
        <div className="fixed bottom-0 left-0 right-0">
          <div className="bg-white p-base border-t flex items-center justify-between">
            {selectedWhiteCards.length > 0 && (
              <>
                <div>
                  <span
                    className={clsx("font-semibold", {
                      "text-error": notEnoughSelected,
                    })}
                  >
                    <span className="font-mono">
                      {selectedWhiteCards.length}
                    </span>{" "}
                    cards selected
                  </span>
                  {notEnoughSelected && (
                    // Display "max N" if too many selected, or "min N" if too little selected
                    <span className="text-gray-light">
                      {" "}
                      (
                      {selectedWhiteCards.length < maxSelection
                        ? "min"
                        : "max"}{" "}
                      <span className="font-mono">{maxSelection}</span>)
                    </span>
                  )}
                </div>
                <Button
                  variant="primary"
                  disabled={notEnoughSelected}
                  onClick={submitWhiteCards}
                >
                  Submit
                </Button>
              </>
            )}
            {/* Only show this if a white card set has been selected, and if there is no round winner */}
            {selectedWhiteCardSet && !roundWinnerName && (
              <>
                <div>Confirm?</div>
                <Button variant="primary" onClick={confirmWhiteCardSet}>
                  Yes
                </Button>
              </>
            )}
            {roundWinnerName && (
              <>
                <div>{roundWinnerName} won the round!</div>
                <Button
                  variant="primary"
                  onClick={readerFinishRound}
                  className="flex-none"
                >
                  Next round
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

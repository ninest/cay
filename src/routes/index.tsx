import { Button } from "@/components/Button";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Spacer } from "@/components/Spacer";
import { fakeRoomId } from "@/utils/names";
import { useNavigate } from "react-router-dom";

export const IndexPage = () => {
  const navigate = useNavigate();

  const startNewGame = () => {
    navigate(`/start/${fakeRoomId()}`);
  };

  return (
    <PageLayout>
      <div className="h-full md:w-2/3 lg:w-1/4 flex flex-col justify-end md:justify-start">
        <Button variant="primary" className="w-full" onClick={startNewGame}>
          Start a new game
        </Button>
        <Spacer size="lg" />
        <hr />
        <Spacer size="lg" />

        <input
          placeholder="Game code"
          className="w-full form-input font-mono"
        />
        <Spacer />
        <Button className="w-full">Join a game</Button>
        <Spacer size="2xl" />
      </div>
    </PageLayout>
  );
};

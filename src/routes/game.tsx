import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../components/layouts/PageLayout";
import { useStore } from "../state/game";

export const GamePage = () => {
  const navigate = useNavigate();
  const { gameStarted } = useStore();
  useEffect(() => {
    if (!gameStarted) {
      navigate("/");
    }
  }, [gameStarted]);
  return <PageLayout>Game page</PageLayout>;
};

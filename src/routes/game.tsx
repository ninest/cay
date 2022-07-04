import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/state/game";
import { PageLayout } from "@/components/layouts/PageLayout";

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

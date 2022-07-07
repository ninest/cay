import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/Button";
import { PageLayout } from "@/components/layouts/PageLayout";

export const GamePage = () => {
  const navigate = useNavigate();
  let { roomId } = useParams();

  const round = () => {};

  return (
    <PageLayout className="h-full flex">
      
    </PageLayout>
  );
};

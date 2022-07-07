import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PageLayout } from "@/components/layouts/PageLayout";
import { client } from "@/liveblocks";
import { Button } from "@/components/Button";

export const GamePage = () => {
  const navigate = useNavigate();
  let { roomId } = useParams();

  const round = () => {};

  return (
    <PageLayout className="h-full flex">
      <div className="flex-1">
        <div className="text-xl font-black">
          {/* {isReader ? (
            <span>You are the black card reader</span>
          ) : (
            <span>
              <>{readerName} is the black card reader</>
            </span>
          )} */}
        </div>

        <Button onClick={round}>Round</Button>

        {/* <div>{others.length + 1} total players</div> */}
      </div>
      {/* <div className="flex-1">{reader as string}</div> */}
      <div className="flex-1">
        <pre>{JSON.stringify({}, null, 2)}</pre>
      </div>
    </PageLayout>
  );
};

import { useEffect } from "react";
import { useStore } from "./state/game";

function App() {
  const {
    liveblocks: { enterRoom, leaveRoom, others },
    setName,
  } = useStore();

  useEffect(() => {
    enterRoom("one", {});

    return () => {
      leaveRoom("one");
    };
  }, [enterRoom, leaveRoom]);

  return (
    <main>
      <h1>One</h1>
      <button onClick={() => setName("Hello")}>Set name</button>
      <div className="font-mono">{JSON.stringify(others, null, 2)}</div>
    </main>
  );
}

export default App;

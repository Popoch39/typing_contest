"use client"

import useGameServer from "@/hooks/useGameServer";
import { joinMatchMaking } from "@/lib/gameClient";
import { Button } from "./ui/button";
import useGameStore from "@/stores/GameStore";

const TestComponent = () => {

  const matchmakingStatus = useGameStore((state) => state.status);
  const client = useGameServer();

  const handleClick = () => {
    if (!client) {
      console.error('game client not iniatilised yet');
      return;
    }
    joinMatchMaking(client);
  }

  console.log(client);
  return (
    <>
      {matchmakingStatus}
    <Button onMouseDown={handleClick}>Rejoindre le matchmaking</Button>
    </>
  )
};

export default TestComponent;

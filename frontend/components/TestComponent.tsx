"use client"

import useGameServer from "@/hooks/useGameServer";
import { joinMatchMaking } from "@/lib/gameClient";
import { Button } from "./ui/button";
import useGameStore from "@/stores/GameStore";
import AlertDialog from "./AlertDialog";
import useMatchmakingEvents from "@/hooks/useMatchmakingEvents";

const TestComponent = () => {
  const room = useGameStore(state => state.currentRoom)
  const matchmakingStatus = useGameStore((state) => state.status);
  const updateRoom = useGameStore(state => state.updateRoom);
  const client = useGameServer();
    useMatchmakingEvents(client)

  const handleClick = () => {
    if (!client) {
      console.error('game client not iniatilised yet');
      return;
    }
    joinMatchMaking(client, updateRoom);
  }

  const hanleQuit = (): void => {
    if (!room) return;
    room.leave();
  }

  console.log(client);
  return (
    <>
      {JSON.stringify(room)}
      <br />
      {matchmakingStatus}
      {matchmakingStatus === "inactif" ? (
        <Button onMouseDown={handleClick}>Rejoindre le matchmaking</Button>
      ) : (
        <Button onMouseDown={hanleQuit}>Quitter la file</Button>
      )}
      <AlertDialog open={false} />
    </>
  )
};

export default TestComponent;

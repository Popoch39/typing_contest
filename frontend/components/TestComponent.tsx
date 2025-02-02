"use client"

import useGameServer from "@/hooks/useGameServer";
import { joinMatchMaking } from "@/lib/gameClient";
import { Button } from "./ui/button";
import AlertDialog from "./AlertDialog";
import useMatchmakingEvents from "@/hooks/useMatchmakingEvents";
import useMatchmakingStore from "@/stores/MatchMakingStore";
import { useState } from "react";

const TestComponent = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const room = useMatchmakingStore(state => state.currentRoom)
    const status = useMatchmakingStore(state => state.status)
  const matchmakingStatus = useMatchmakingStore((state) => state.status);
  const updateRoom = useMatchmakingStore(state => state.updateRoom);
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
    </>
  )
};

export default TestComponent;

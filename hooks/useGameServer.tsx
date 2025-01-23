"use client";
import { createClient, createRoom } from "@/lib/gameClient";
import { useEffect } from "react";

const useGameServer = () => {
  useEffect(() => {
    const client = createClient();

    createRoom(client, "room_test");
  }, []);

  return null;
};

export default useGameServer;

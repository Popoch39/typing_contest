"use client";
import { createClient, createRoom } from "@/lib/gameClient";
import { useEffect } from "react";

const useGameServer = () => {

	const a = [1, 2, 3]

  useEffect(() => {
    const client = createClient();

    createRoom(client);
  }, []);

  return null;
};

export default useGameServer;

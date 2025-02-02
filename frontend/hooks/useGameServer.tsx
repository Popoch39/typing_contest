"use client";
import { createClient, createRoom } from "@/lib/gameClient";
import useMatchmakingStore from "@/stores/MatchMakingStore";
import { Client } from "colyseus.js";
import { useEffect, useState } from "react";

const useGameServer = () => {
  const updateStatus = useMatchmakingStore((state) => state.updateStatus)
  const [client, setClient] = useState<Client | null>(null);
  useEffect(() => {
    setClient(createClient());
  }, []);

  return client;
};

export default useGameServer;

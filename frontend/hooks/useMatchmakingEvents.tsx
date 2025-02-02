import { joinGameRoom } from "@/lib/gameClient";
import useGameStore from "@/stores/GameStore";
import { Client } from "colyseus.js";
import { useEffect } from "react";

const useMatchmakingEvents = (client: Client) => {
  const room = useGameStore(state => state.currentRoom);
  const updateStatus = useGameStore(state => state.updateStatus);
  const updateRoom = useGameStore(state => state.updateRoom)

  useEffect(() => {
    if (!room) return;
    room.onMessage("joined", (): void => {
      console.log("joined matchmaking")
      updateStatus("inQueue")
    })

    room.onMessage("canceled", () => {
      updateRoom(null);
      updateStatus("inactif")
    })

    room.onMessage("matchFound", (data) => {
      console.log('match found you have ' + data.timeout + "sec to accept")
      console.log("players => ", data.players)
    })

    room.onMessage("playerAccepted", (data) => {
      console.log(`Le joueur ${data.playerId} a accepté le match`);
      // Mettre à jour l'UI pour montrer qui a accepté
    });
    room.onMessage("matchAccepted", () => {
      console.log("Tous les joueurs ont accepté! Préparation de la partie...");
    });

    room.onMessage("matchDeclined", (data) => {
      console.log(`Le joueur ${data.playerId} a refusé le match`);
      // Retour à la recherche
    });

    room.onMessage("matchCancelled", (data) => {
      console.log(`Match annulé: ${data.reason}`);
      // Retour à la recherche
    });


    room.onMessage("matchStarted", (): void => {
      console.log("match is starting...")
    })

    room.onMessage("gameReady", (data: any) => {
      console.log('game room is ready');
      joinGameRoom(client, data.roomId, data.reservation)
    })


  }, [room]);

};

export default useMatchmakingEvents;


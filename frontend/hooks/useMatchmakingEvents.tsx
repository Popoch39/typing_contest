import { joinGameRoom } from "@/lib/gameClient";
import useMatchmakingStore from "@/stores/MatchMakingStore";
import { Client } from "colyseus.js";
import { useEffect } from "react";

const useMatchmakingEvents = (client: Client | null) => {
  const room = useMatchmakingStore(state => state.currentRoom);
  const updateStatus = useMatchmakingStore(state => state.updateStatus);
  const updateRoom = useMatchmakingStore(state => state.updateRoom)

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
      updateStatus("gameFound");
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
      try {
        if (!client) {
          throw new Error("aucun client trouvé")
        }
        console.log('game room is ready');
        joinGameRoom(client, data.roomId, data.reservation)
      } catch (e) {
        console.error("aucun client trouvé => ", e);
      }
    })

  }, [client, room]);

};

export default useMatchmakingEvents;


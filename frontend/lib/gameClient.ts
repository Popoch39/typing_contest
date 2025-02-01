import { Client, Room } from "colyseus.js";

export const createClient = (): Client => {
  const serverAdress: string = "ws://localhost:2567";
  const client: Client = new Client(serverAdress);
  return client;
};

export const createRoom = async (
  client: Client,
): Promise<void> => {
  const roomName = "my_room"
  console.log(roomName);
  const room = await client.joinOrCreate(roomName, {
  });
  console.log("room id", room.roomId);
};


export const joinMatchMaking = async (client: Client) => {
  try {
    const room: Room<unknown> = await client.joinOrCreate("matchmaking");
    room.onMessage("joined", (): void => {
      console.log("joined matchmaking")
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
  } catch (error: any) {
    console.error("error joining the matchmaking", error)
  }
};

async function joinGameRoom(client: Client, roomId: string, reservation: any) {
  try {
    const gameRoom = await client.consumeSeatReservation(reservation);
    console.log("Joined game room successfully");

    //TODO : START GAME HERE 
  } catch (error) {
    console.error("Error joining game room:", error);
  }
}

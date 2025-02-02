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


export const joinMatchMaking = async (client: Client, updateRoom: (data: any) => void) => {
  try {
    const room = await client.joinOrCreate("matchmaking", {
      elo: 2000
    });
    updateRoom(room);
  } catch (error: any) {
    console.error("error joining the matchmaking", error)
  }
};

export async function joinGameRoom(client: Client, roomId: string, reservation: any) {
  try {
    const gameRoom = await client.consumeSeatReservation(reservation);
    console.log("Joined game room successfully");

    //TODO : START GAME HERE 
  } catch (error) {
    console.error("Error joining game room:", error);
  }
}

import { Client } from "colyseus.js";

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
    code: "one",
  });
  console.log("room id", room.roomId);
};

import { Client } from "colyseus.js";

export const createClient = (): Client => {
  const serverAdress: string = "ws://localhost:2567";
  const client: Client = new Client(serverAdress);
  return client;
};

export const createRoom = async (
  client: Client,
  roomName: string,
): Promise<void> => {
  console.log(roomName);
  let timer = 100;
  while (timer > 0) {
    const room = await client.joinOrCreate(roomName, {
      code: "one",
    });

    await room.leave();
    timer -= 1;
    console.log("room id", room.roomId);
  }
};

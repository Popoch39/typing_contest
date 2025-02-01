import { Room, Client } from "@colyseus/core";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {

    this.onMessage("type", (client, message) => {
     console.log(client, message);
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    console.log("leaving", consented);
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    // matches end, persist data? 
    console.log("room", this.roomId, "disposing...");
  }
}

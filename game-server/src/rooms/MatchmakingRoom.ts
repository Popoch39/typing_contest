import { Client, matchMaker, Room } from "colyseus";
import { MatchmakingTicket } from "./schema/MatchTypes";
import { MatchState } from "./schema/MatchState";
import { ExtractUserData, ExtractAuthData } from "@colyseus/core/build/Room";
import { PlayerState } from "./schema/PlayerState";

export class MatchmakingRoom extends Room<MatchState> {
  maxClients: number = 3;

  requestJoin(options: any) {
    // Prevent the client from joining the same room from another browser tab
    return this.clients.filter(c => c.id === options.clientId).length === 0;
  }

  async onCreate() {
    this.setState(new MatchState());

    this.onMessage("ready", (client: Client) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.ready = true;

        // check if all users are ready
        if (this.areAllPlayersReady()) {
          this.broadcast("matchStarted");
          this.createGameRoom();
        }
      }
    })
  }

  onJoin(client: Client<ExtractUserData<this["clients"]>, ExtractAuthData<this["clients"]>>, options?: any, auth?: ExtractAuthData<this["clients"]>): void | Promise<any> {
    const player = new PlayerState();
    player.id = client.sessionId;
    this.state.players.set(client.sessionId, player);

    client.send("joined");

    if (this.clients.length === this.maxClients) {
      this.broadcast("roomFull");
    }
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
  }

  areAllPlayersReady = () => {
    let allReady = true;
    this.state.players.forEach((player) => {
      if (!player.ready) allReady = false;
    });

    // if alone in room are allPlayersReady should be false;
    return allReady && this.clients.length === this.maxClients;
  }

  createGameRoom = async () => {
    try {
      const gameRoom = await matchMaker.createRoom("game", {});

      this.clients.forEach(async (client) => {
        const reservation = await matchMaker.reserveSeatFor(gameRoom, {
          clientId: client.sessionId
        })

        client.send("gameReady", {
          gameRoom: gameRoom.roomId,
          reservation
        })
      })
    } catch (err: any) {
      console.error("Erreur lors de la création de la room du jeu", err);
      this.broadcast("matchError", "unable to create the game")
    }
  };
}

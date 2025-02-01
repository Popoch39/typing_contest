import { Client, matchMaker, Room } from "colyseus";
import { MatchmakingTicket } from "./schema/MatchTypes";
import { MatchState } from "./schema/MatchState";
import { ExtractUserData, ExtractAuthData } from "@colyseus/core/build/Room";
import { PlayerState } from "./schema/PlayerState";

export class MatchmakingRoom extends Room<MatchState> {
  maxClients: number = 2;
  private acceptanceTimeout: NodeJS.Timeout

  requestJoin(options: any) {
    // Prevent the client from joining the same room from another browser tab
    return this.clients.filter(c => c.id === options.clientId).length === 0;
  }

  async onCreate() {
    this.setState(new MatchState());

    this.onMessage("acceptMatch", (client: Client) => {
      const player = this.state.players.get(client.sessionId);
      if (player && this.state.isWaitingForAcceptance) {
        player.hasAccepted = true;
        player.ready = true;
        console.log(player);
        this.broadcast("playerAccepted", { playerId: client.sessionId });
        // check if all users have accepted
        if (this.haveAllPlayersAccepted()) {
          this.clearAcceptanceTimeout();
          this.setAllPlayersReady();
          this.broadcast("matchAccepted")
          this.createGameRoom();
        }
      }
    })

    this.onMessage("declineMatch", (client: Client) => {
      if (this.state.isWaitingForAcceptance) {
        this.clearAcceptanceTimeout()
        this.broadcast("matchDeclined", { playerId: client.sessionId });
        this.resetMatchmaking();
      }
    })
  }

  onJoin(client: Client<ExtractUserData<this["clients"]>, ExtractAuthData<this["clients"]>>, options?: any, auth?: ExtractAuthData<this["clients"]>): void | Promise<any> {
    const player = new PlayerState();
    player.id = client.sessionId;
    this.state.players.set(client.sessionId, player);

    client.send("joined");
    console.log("joined !");

    if (this.clients.length === this.maxClients) {
      this.startMatchAcceptancePhase();
    }
  }

  onLeave(client: Client) {
    if (this.state.isWaitingForAcceptance) {
      this.clearAcceptanceTimeout();
      this.broadcast("matchCancelled", { reason: "Un joueur a quitté" });
      this.resetMatchmaking();
    }
    this.state.players.delete(client.sessionId);
  }

  private startMatchAcceptancePhase = () => {
    this.state.isWaitingForAcceptance = true;

    this.broadcast("matchFound", {
      timeout: this.state.matchAcceptanceTimeout,
      players: Array.from(this.state.players.values().map(p => p.id))
    })

    this.acceptanceTimeout = setTimeout(() => {
      if (!this.haveAllPlayersAccepted()) {
        this.broadcast("matchCancelled", { reason: "Temps d'acceptation dépassé" });
        this.resetMatchmaking();
      }
    }, this.state.matchAcceptanceTimeout * 1000)
  }

  private haveAllPlayersAccepted = (): boolean => {
    let allAccepted = true;
    this.state.players.forEach((player) => {
      console.log(player);
      if (player.hasAccepted === false) {
        allAccepted = false;
      }
    })
    return allAccepted;
  }

  private setAllPlayersReady = () => {
    this.state.players.forEach((player) => {
      player.ready = true;
    });
  }

  private clearAcceptanceTimeout = () => {
    if (this.acceptanceTimeout) {
      clearTimeout(this.acceptanceTimeout);
    }
  }

  private resetMatchmaking = () => {
    this.state.isWaitingForAcceptance = false;
    this.state.players.forEach((player) => {
      player.hasAccepted = false;
      player.ready = false;
    });
  };

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

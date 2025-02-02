import { Client, matchMaker, Room } from "colyseus";
import { QueueState } from "./schema/MatchState";
import { ExtractUserData, ExtractAuthData } from "@colyseus/core/build/Room";
import { PlayerState } from "./schema/PlayerState";


// Already looking like spaghetty code, maybe 
export class MatchmakingRoom extends Room<QueueState> {
  maxClients: number = 1000; // hopefully the queue will be full someday eheh
  private acceptanceTimeout: NodeJS.Timeout
  private matchmakingInterval: NodeJS.Timeout;
  private activeMatches = new Map<string, Set<string>>(); // groupId -> playerIds
  private readonly ELO_RANGE_INCREMENT = 50;
  private readonly MATCH_CHECK_INTERVAL = 5000;

  requestJoin(options: any) {
    // Prevent the client from joining the same room from another browser tab
    return this.clients.filter(c => c.id === options.clientId).length === 0;
  }

  async onCreate() {
    this.setState(new QueueState());

    this.matchmakingInterval = setInterval(this.findMatches, this.MATCH_CHECK_INTERVAL);

    this.onMessage("acceptMatch", (client: Client, matchId: string) => {
      const player = this.state.players.get(client.sessionId);
      console.log("player " + player.id, " accepted the match")
      if (player && !player.hasAccepted) {
        player.hasAccepted = true;
        player.ready = true;
        this.checkMatchAcceptance(matchId);
      }
    })

    this.onMessage("declineMatch", (client: Client) => {
      this.onMessage("declineMatch", (client, matchId) => {
        this.cancelMatch(matchId);
      });
    })
  }

  onJoin(client: Client<ExtractUserData<this["clients"]>, ExtractAuthData<this["clients"]>>, options?: any, auth?: ExtractAuthData<this["clients"]>): void | Promise<any> {
    const player = new PlayerState();
    player.id = client.sessionId;
    player.elo = options.elo || 1000;
    player.joinedAt = Date.now();
    player.minimumElo = player.elo;
    player.maximumElo = player.elo;

    this.state.players.set(client.sessionId, player);

    client.send("joined");
    console.log("joined !");
    console.log(this.state.players.size);

    console.log(`Joueur ${client.sessionId} (ELO: ${player.elo}) a rejoint la file`);

    // TODO, allow alot of people in the queue && do some elo based matchmaking within the queue 
    // code below is garbage
    //if (this.clients.length === this.maxClients) {
    //  this.startMatchAcceptancePhase();
    //}
  }

  onLeave(client: Client) {
    client.send("canceled");
    this.activeMatches.forEach((players, matchId) => {
      console.log("canceled");
      if (players.has(client.sessionId)) {
        this.cancelMatch(matchId);
      }
    });
    this.state.players.delete(client.sessionId);
  }

  private findMatches = () => {
    const now = Date.now();
    const availablePlayers = Array.from(this.state.players.values())
      .filter(p => !p.isMatched)
      .sort((a, b) => a.joinedAt - b.joinedAt);

    for (let i = 0; i < availablePlayers.length; i++) {
      const player1 = availablePlayers[i]
      if (player1.isMatched) continue

      // Augmenter la plage ELO en fonction du temps d'attente
      console.log("joined at", player1.joinedAt);
      const waitTime = Math.floor((now - player1.joinedAt) / 1000);
      console.log("waittime", waitTime);
      const eloRange = Math.floor(waitTime / 10) * this.ELO_RANGE_INCREMENT;

      console.log("elo range : ", eloRange);

      player1.minimumElo = Math.max(0, player1.elo - eloRange);
      player1.maximumElo = player1.elo + eloRange;

      // Rechercher un adversaire compatible
      for (let j = i + 1; j < availablePlayers.length; j++) {
        const player2 = availablePlayers[j];
        if (player2.isMatched) continue;

        if (this.arePlayersCompatible(player1, player2)) {
          console.log("match found !")
          console.log("player 1 elo : ", player1.elo);
          console.log("player 2 elo : ", player2.elo);
          this.createMatch(player1, player2);
          break;
        } else {
          console.log("player 1 minimum : ", player1.minimumElo);
          console.log("player 1 max: ", player1.maximumElo);
          console.log("player 2 minimum : ", player2.minimumElo);
          console.log("player 2 minimum : ", player2.minimumElo);
          console.log("found someone but not compatible")
        }
      }
    }
  }

  private arePlayersCompatible(player1: PlayerState, player2: PlayerState): boolean {
    return player1.elo >= player2.minimumElo &&
      player1.elo <= player2.maximumElo &&
      player2.elo >= player1.minimumElo &&
      player2.elo <= player1.maximumElo;
  }

  private createMatch(player1: PlayerState, player2: PlayerState) {
    const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Marquer les joueurs comme matchés
    player1.isMatched = true;
    player2.isMatched = true;

    // Enregistrer le match
    this.activeMatches.set(matchId, new Set([player1.id, player2.id]));

    // Envoyer la demande d'acceptation aux deux joueurs
    const matchData = {
      matchId,
      timeout: this.state.matchAcceptanceTimeout,
      players: [
        { id: player1.id, elo: player1.elo },
        { id: player2.id, elo: player2.elo }
      ]
    };

    this.clients.forEach(client => {
      if (client.sessionId === player1.id || client.sessionId === player2.id) {
        client.send("matchFound", matchData);
      }
    });

    // Timeout pour l'acceptation
    setTimeout(() => this.checkMatchAcceptance(matchId), this.state.matchAcceptanceTimeout * 1000);
  }


  private checkMatchAcceptance(matchId: string) {
    const playerIds = this.activeMatches.get(matchId);
    if (!playerIds) return;

    const players = Array.from(playerIds).map(id => this.state.players.get(id));
    if (players.every(p => p?.hasAccepted)) {
      this.startGame(matchId);
    }
  }

  private startGame(matchId: string) {
    const playerIds = this.activeMatches.get(matchId);
    if (!playerIds) return;

    this.createGameRoom(Array.from(playerIds));
    this.activeMatches.delete(matchId);
  }

  private cancelMatch(matchId: string) {
    const playerIds = this.activeMatches.get(matchId);
    if (!playerIds) return;

    // Réinitialiser les joueurs
    playerIds.forEach(playerId => {
      const player = this.state.players.get(playerId);
      if (player) {
        player.isMatched = false;
        player.hasAccepted = false;
        // Mettre à jour le temps de jointure pour ne pas avoir une trop grande plage ELO immédiatement
        player.joinedAt = Date.now();
      }
    });

    // Informer les joueurs
    playerIds.forEach(playerId => {
      const client = this.clients.find(c => c.sessionId === playerId);
      if (client) {
        client.send("matchCancelled", { matchId });
      }
    });

    this.activeMatches.delete(matchId);
  }

  private async createGameRoom(playerIds: string[]) {
    try {
      const gameRoom = await matchMaker.createRoom("game", {});

      // Réserver les places pour chaque joueur
      const promises = playerIds.map(async (playerId) => {
        const client = this.clients.find(c => c.sessionId === playerId);
        if (client) {
          const reservation = await matchMaker.reserveSeatFor(gameRoom, {
            clientId: playerId,
            elo: this.state.players.get(playerId)?.elo
          });
          client.send("gameReady", { roomId: gameRoom.roomId, reservation });
        }
      });

      await Promise.all(promises);

    } catch (error) {
      console.error("Erreur lors de la création de la room de jeu:", error);
      playerIds.forEach(playerId => {
        const client = this.clients.find(c => c.sessionId === playerId);
        if (client) {
          client.send("matchError", "Impossible de créer la partie");
        }
      });
    }
  }

  onDispose() {
    if (this.matchmakingInterval) {
      clearInterval(this.matchmakingInterval);
    }
  }

}

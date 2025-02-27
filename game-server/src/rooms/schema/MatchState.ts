import { Schema, Context, type } from "@colyseus/schema";
import { PlayerState } from "./PlayerState";

export class QueueState extends Schema {
  @type({ map: PlayerState }) players = new Map<string, PlayerState>();
  @type("number") matchAcceptanceTimeout: number = 15; // 5 secondes pour accepter le match
  @type("boolean") isWaitingForAcceptance: boolean = false;
}

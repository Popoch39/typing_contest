import { Schema, Context, type } from "@colyseus/schema";
import { PlayerState } from "./PlayerState";

export class MatchState extends Schema {
 @type({ map: PlayerState }) players = new Map<string, PlayerState>();
}

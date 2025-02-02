import { Schema, type } from "@colyseus/schema";

export class PlayerState extends Schema {
  @type("string") id: string;
  @type("boolean") ready: boolean = false;
  @type("boolean") hasAccepted: boolean = false;
  @type("number") elo: number;
  @type("number") joinedAt: number;
  @type("boolean") isMatched: boolean = false;

  minimumElo: number;
  maximumElo: number;
}


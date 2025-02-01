import { Schema, Context, type } from "@colyseus/schema";

export class matchmakingState extends Schema {

  @type("string")
  gameState: "waiting" | "starting" | "playing" | "finished" = "waiting";

  @type("number")
  timestamp: number = 0;

}


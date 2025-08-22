"use client"
import GameEngine from "@repo/game-engine";
import React, { useRef } from "react";

const buffer = ["test", "louis", "un", "long", "buffer"];

const TestGame = () => {
  const inputRef = useRef<HTMLDivElement>(null);

  const gameInstance = GameEngine.getInstance(buffer);
  const bufferString = gameInstance.bufferToString()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void  => {
    const key = e.key;
    gameInstance.handleKeyStroke(key) ;
  }

  return (
    <div
      ref={inputRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="focus:border-2 w-xl h-dvh p-4"
    >
      {bufferString}
    </div>
  )
}

export default TestGame;

"use client"
import GameEngine from "@repo/game-engine";
import React, { useRef, useState, useEffect } from "react";

const buffer = ["test", "louis", "un", "long", "buffer"];

const TestGame = () => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [tick, setTick] = useState(0);
  const [finished, setFinished] = useState(false);
  const gameInstance = GameEngine.getInstance(buffer);

  const activeLetterRef = useRef<HTMLSpanElement>(null);
  const [cursorStyle, setCursorStyle] = useState({ top: 0, left: 0, height: 0 });

  useEffect(() => {
    if (!finished && inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
    if (activeLetterRef.current) {
      const { offsetLeft, offsetTop, offsetHeight } = activeLetterRef.current;
      setCursorStyle({ top: offsetTop, left: offsetLeft, height: offsetHeight });
    }
  }, [tick, finished, gameInstance]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (finished) return;

    const key = e.key;
    if (key === " ") e.preventDefault();

    if (key.length === 1 || key === "Backspace") {
      gameInstance.handleKeyStroke(key);
      if (gameInstance.isFinished()) {
        setFinished(true);
      }
      setTick(t => t + 1);
    }
  }

  const handleRestart = () => {
    gameInstance.reset();
    setFinished(false);
    setTick(t => t + 1);
    inputRef.current?.focus();
  }

  return (
    <div className="p-4 font-mono">
      <div className="flex gap-4 text-xl mb-4">
        <div>
          <span className="font-bold">WPM:</span> {gameInstance.stats.getWPM()}
        </div>
        <div>
          <span className="font-bold">Accuracy:</span> {gameInstance.stats.getAccuracy().toFixed(1)}%
        </div>
      </div>
      <div
        ref={inputRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative focus:outline-none w-xl p-4 flex flex-row gap-x-2 gap-y-4 flex-wrap border rounded-md"
        onClick={() => inputRef.current?.focus()}
      >
        {finished && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col justify-center items-center z-10">
            <div className="text-2xl font-bold">Partie Terminée !</div>
            <button
              onClick={handleRestart}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Recommencer
            </button>
          </div>
        )}

        {!finished && <span
          style={{ ...cursorStyle, position: 'absolute' }}
          className="w-0.5 bg-blue-600 transition-all duration-100 ease-linear"
        />}

        {gameInstance.buffer.map((word, wordIndex) => {
          const typedWord = gameInstance.gameBuffer[wordIndex] || "";
          const displayLetters = [...word, '\u200B']; // Add zero-width space for cursor at the end

          if (typedWord.length > word.length) {
            displayLetters.splice(word.length, 0, ...typedWord.substring(word.length));
          }

          const wordState = gameInstance.getWordState(wordIndex);
          const wordStyle = wordState === 'incorrect' ? 'underline decoration-red-500 decoration-2' : '';

          return (
            <div key={wordIndex} className={`flex items-center p-1 ${wordStyle}`}>
              {displayLetters.map((letter, letterIndex) => {
                const isCurrent = gameInstance.wordIndex === wordIndex && gameInstance.cursorWordIndex === letterIndex;
                const isExtra = letterIndex >= word.length && letter !== '\u200B';
                const originalLetter = word[letterIndex];
                const typedLetter = typedWord[letterIndex];

                let className = "text-gray-400";
                if (letterIndex < typedWord.length) { // is typed
                  if (isExtra) {
                    className = "text-red-500 bg-red-100";
                  } else {
                    className = typedLetter === originalLetter ? "text-black" : "text-red-500";
                  }
                }

                return (
                  <span
                    ref={isCurrent ? activeLetterRef : null}
                    key={letterIndex}
                    className={`p-1 ${className}`}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default TestGame;

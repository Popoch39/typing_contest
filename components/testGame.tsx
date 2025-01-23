"use client";
export const headers = {
  "Cache-Control": "no-store",
};

export const dynamic = "force-dynamic";

import { useState } from "react";
import { LineShadowText } from "./ui/line-shadow-text";
import { useTheme } from "next-themes";
const wordList = [
  "arbre",
  "bouteille",
  "ciel",
  "drapeau",
  "étoile",
  "forêt",
  "guitare",
  "horizon",
  "imagination",
  "jongler",
  "kayak",
  "lumière",
  "montagne",
  "nuage",
  "océan",
  "papillon",
  "quintessence",
  "rivière",
  "soleil",
];
const POINTS_PER_WORD = 10;

const TestGame = () => {
  const theme = useTheme();
  const shadowColor = theme.resolvedTheme === "dark" ? "blue" : "red";
  const [score, setScore] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [completedWords, setCompletedWords] = useState(
    Array(wordList.length).fill(null),
  );
  const [scoredWords, setScoredWords] = useState(new Set()); // Garde une trace des mots déjà comptabilisés

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const words = value.split(" ");
    const spaceCount = (value.match(/ /g) || []).length;

    // Met à jour l'index du mot actuel et vérifie les mots complétés
    if (spaceCount < wordList.length) {
      const newIndex = spaceCount;

      // Si on passe à un nouveau mot
      if (newIndex !== currentWordIndex) {
        const completedWordIndex = currentWordIndex;
        const completedWord = words[completedWordIndex];
        const isCorrect = completedWord === wordList[completedWordIndex];

        // Met à jour le statut du mot
        const newCompletedWords = [...completedWords];
        newCompletedWords[completedWordIndex] = isCorrect;
        setCompletedWords(newCompletedWords);

        // Ajoute des points seulement si le mot est correct ET n'a pas déjà été comptabilisé
        if (isCorrect && !scoredWords.has(completedWordIndex)) {
          setScore((prevScore) => prevScore + POINTS_PER_WORD);
          setScoredWords((prev) => new Set([...prev, completedWordIndex]));
        }
      }

      setCurrentWordIndex(newIndex);
    }
  };

  const getCurrentTypedWord = () => {
    return inputValue.split(" ")[currentWordIndex] || "";
  };

  const WordRenderer = ({ word, index }: { word: string; index: number }) => {
    const typedWord = index === currentWordIndex ? getCurrentTypedWord() : "";

    if (index < currentWordIndex) {
      const isCorrect = completedWords[index];
      return (
        <span
          className={`p-1 rounded text-5xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl ${isCorrect ? "text-gray-400" : "text-red-600"}`}
        >
          {word}
        </span>
      );
    }

    return (
      <span
        className={`p-1 rounded text-5xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl ${index === currentWordIndex ? "bg-blue-100" : ""}`}
      >
        {word.split("").map((letter, letterIndex) => {
          let color = "text-gray-800"; // Couleur par défaut pour les mots à venir

          if (index === currentWordIndex) {
            if (letterIndex < typedWord.length) {
              color =
                typedWord[letterIndex] === letter
                  ? "text-green-600"
                  : "text-red-600";
            }
          }

          return (
            <span
              key={letterIndex}
              className={`${color} text-5xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl`}
            >
              {letter}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div className="w-2/3 h-auto border-solid border-2 border-indigo-500 p-4">
      <div className="flex flex-wrap text-5xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
        {wordList.map((word, index) => (
          <WordRenderer key={index} word={word} index={index} />
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="mt-4 p-2 border border-gray-300 text-3xl tracking-widest text-center w-full"
      />
      <div className="text-sm text-gray-600">Score: {score}</div>
    </div>
  );
};

export default TestGame;

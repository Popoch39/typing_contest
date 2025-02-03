"use client";
export const headers = {
  "Cache-Control": "no-store",
};
export const dynamic = "force-dynamic";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
const wordList = [
  "arbre",
  "bouteille",
  "drapeau",
];
const POINTS_PER_WORD = 10;

const TestGame = () => {

  const [queuePointer, setQueuePointer] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>(wordList[queuePointer]);
  const [pointer, setPointer] = useState<number>(0);
  const [wordIsRight, setWordIsRight] = useState<boolean>(false);
  const handleClickRef = useRef<(letter: string) => void>(() => { });

  handleClickRef.current = (letter: string) => {
    if (letter === " ") {
      console.log("space was hit");
      setQueuePointer(prev => prev + 1);
      setPointer(0);
    }
    if (letter === currentWord[pointer]) {
      console.log("bonne touche, suivante");
      setPointer(prev => prev + 1);
    } else {
      console.log("mauvaise touche");
    }
  };

  useEffect(() => {
    setCurrentWord(wordList[queuePointer]);
  }, [queuePointer, wordList]);

  useEffect(() => {
    console.log("current word => ", currentWord)
    console.log("pointer => ", pointer);
    console.log("queue pointer => ", queuePointer)
  }, [pointer, currentWord, queuePointer])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Capturer tous les événements de clavier
      console.log('Touche pressée:', `[${event.key}]`);
      handleClickRef.current(event.key)
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Tableau de dépendances vide pour n'exécuter qu'une seule fois

  console.log(currentWord)

  const theme = useTheme();
  return (
    <>
      <div style={{ textAlign: "center", fontSize: "24px", fontFamily: "monospace" }}>
      <p style={{ whiteSpace: "pre" }}>
        {/* Partie tapée correctement */}
        <span style={{ color: "green" }}>
          {currentWord.slice(0, pointer)}
        </span>

        {/* Curseur qui clignote pour simuler une frappe */}
        <span style={{ backgroundColor: "yellow", padding: "2px" }}>
          {currentWord[pointer] || " "}
        </span>

        {/* Partie restante à taper */}
        <span style={{ color: "gray" }}>
          {currentWord.slice(pointer + 1)}
        </span>
      </p>

      <p>
        <strong>Mot suivant:</strong>{" "}
        <span style={{ color: "lightgray" }}>{wordList[queuePointer + 1] || "Fin"}</span>
      </p>

      <p>
        <strong>Mot n°:</strong> {queuePointer + 1} / {wordList.length}
      </p>
    </div >

    </>
  )
};

export default TestGame;

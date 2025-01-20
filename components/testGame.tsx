"use client";

import { useState, useEffect } from "react";
import { LineShadowText } from "./ui/line-shadow-text";
import { useTheme } from "next-themes";
const words = [
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
  "tigre",
  "univers",
  "vélo",
  "wagon",
  "xylophone",
  "yoga",
  "zèbre",
  "abeille",
  "abricot",
  "acier",
  "aventure",
  "ami",
  "bateau",
  "bijou",
  "bruit",
  "bureau",
  "cerise",
  "chaise",
  "chanson",
  "chemin",
  "citron",
  "clé",
  "danse",
  "dauphin",
  "désert",
  "diamant",
  "dictionnaaire",
  "éléphant",
  "énergie",
  "éponge",
  "escargot",
  "étoile",
  "fleur",
  "flamme",
  "forêt",
  "fromage",
  "fusée",
  "girafe",
  "guitare",
  "grenouille",
  "gâteau",
  "horloge",
  "horizon",
  "histoire",
  "hôpital",
  "humour",
  "île",
  "imagination",
  "insecte",
  "invitation",
  "jardin",
  "jongler",
  "journal",
  "kayak",
  "koala",
  "kimono",
  "lampe",
  "livre",
  "lune",
  "lumière",
  "machine",
  "magicien",
  "montagne",
  "musique",
  "nuit",
  "nuage",
  "océan",
  "ordinateur",
  "orange",
  "ours",
  "pain",
  "papillon",
  "parapluie",
  "piano",
  "poisson",
  "pont",
  "quiche",
  "question",
  "quintessence",
  "radio",
  "rivière",
  "robot",
  "rouge",
  "sable",
  "sapin",
  "soleil",
  "souris",
  "table",
  "tigre",
  "train",
  "trésor",
  "tulipe",
  "univers",
  "usine",
  "valise",
  "vélo",
  "vent",
  "wagon",
  "walabi",
  "xylophone",
  "yaourt",
  "yoga",
  "zèbre",
  "zoo",
];
const TestGame = () => {
  const theme = useTheme();
  const [currentWord, setCurrentWord] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  // useEffect(() => {
  //   // Choisir un mot aléatoire au début
  //   setCurrentWord(getRandomWord());
  //
  //   // Démarrer le compte à rebours
  //   const timer = setInterval(() => {
  //     setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
  //   }, 1000);
  //
  //   return () => clearInterval(timer); // Nettoyer le timer
  // }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      alert(`Temps écoulé ! Score final : ${score}, Fautes : ${errors}`);
      resetGame();
    }
  }, [timeLeft]);

  const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === currentWord) {
      setScore((prevScore) => prevScore + 1);
      setCurrentWord(getRandomWord());
      setInputValue("");
    } else if (!currentWord.startsWith(value.trim())) {
      setErrors((prevErrors) => prevErrors + 1);
    }
  };

  const resetGame = () => {
    setCurrentWord(getRandomWord());
    setInputValue("");
    setScore(0);
    setErrors(0);
    setTimeLeft(30);
  };

  const shadowColor = theme.resolvedTheme === "dark" ? "blue" : "red";
  return (
    <div className="w-2/3 h-auto border-solid border-2 border-indigo-500">
      <div className="flex flex-row justify-center items-center flex-wrap">
        {words.map((word, k: number) => (
          <h1 className="text-balance text-5xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
            Ship
            <LineShadowText
              className="italic"
              shadowColor={shadowColor}
              key={k}
            >
              {word}
            </LineShadowText>
          </h1>
        ))}
      </div>
    </div>
  );
};

export default TestGame;

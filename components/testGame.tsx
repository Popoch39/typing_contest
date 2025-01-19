"use client";

import { useState, useEffect } from "react";
const words = ["react", "javascript", "programming", "developer", "frontend"];
const TestGame = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    // Choisir un mot aléatoire au début
    setCurrentWord(getRandomWord());

    // Démarrer le compte à rebours
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(timer); // Nettoyer le timer
  }, []);

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

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Typing Game</h1>
      <h2>Mot actuel : {currentWord}</h2>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Tapez ici"
        autoFocus
      />
      <div>
        <p>Score : {score}</p>
        <p>Fautes : {errors}</p>
        <p>Temps restant : {timeLeft}s</p>
      </div>
      <button onClick={resetGame}>Réinitialiser</button>
    </div>
  );
};

export default TestGame;

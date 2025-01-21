"use client";
export const headers = {
  "Cache-Control": "no-store",
};

export const dynamic = "force-dynamic";

import { useState } from "react";
import { LineShadowText } from "./ui/line-shadow-text";
import { useTheme } from "next-themes";
const words = [
  ["arbre", "bouteille", "ciel", "drapeau", "étoile"],
  ["forêt", "guitare", "horizon", "imagination", "jongler", "kayak"],
  ["lumière", "montagne", "nuage", "océan", "papillon"],
  ["quintessence", "rivière", "soleil", "tigre", "univers"],
  ["vélo", "wagon", "xylophone", "yoga", "zèbre"],
];
const TestGame = () => {
  const theme = useTheme();
  const shadowColor = theme.resolvedTheme === "dark" ? "blue" : "red";

  const [inputValue, setInputValue] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const targetText = words.map((row) => row.join(" ")).join(" ");

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Vérification lettre par lettre
    if (value.length <= targetText.length) {
      setInputValue(value);
      setCurrentIndex(value.length);
    }
  };

  return (
    <div className="w-2/3 h-auto border-solid border-2 border-indigo-500 p-4">
      <div className="flex flex-wrap text-5xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
        {targetText.split("").map((char, index) => (
          <span
            key={index}
            className={
              index < inputValue.length
                ? inputValue[index] === char
                  ? "text-green-500" // Lettre correcte
                  : "text-red-500" // Lettre incorrecte
                : "text-gray-500" // Lettre pas encore tapée
            }
          >
            {char === " " ? "\u00A0" : char} {/* Garde les espaces visibles */}
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="mt-4 p-2 border border-gray-300 text-3xl tracking-widest text-center w-full"
      />
    </div>
  );
};

export default TestGame;

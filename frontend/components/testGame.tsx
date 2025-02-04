"use client"
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

const TestGame = () => {
  const [text, setText] = useState("Voici une phrase complète à taper.");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [mistakes, setMistakes] = useState(new Set());
  const [skippedWords, setSkippedWords] = useState(new Set());
  const [extraLetters, setExtraLetters] = useState<{[key: number]: string[]}>({});
  const [cursorLeft, setCursorLeft] = useState(0);
  const textRef = useRef<HTMLParagraphElement>(null);
  const handleClickRef = useRef<(letter: string) => void>(() => {});

  const getWordBoundaries = (text: string) => {
    const words = text.split(' ');
    const boundaries = [];
    let currentIndex = 0;
    
    words.forEach(word => {
      boundaries.push({
        start: currentIndex,
        end: currentIndex + word.length
      });
      currentIndex += word.length + 1;
    });
    
    return boundaries;
  };

  const wordBoundaries = getWordBoundaries(text);

  const isAtWordEnd = () => {
    return cursorPosition >= wordBoundaries[currentWordIndex].end;
  };

  const updateCursorPosition = () => {
    if (textRef.current) {
      const spans = textRef.current.querySelectorAll('span[data-index]');
      const currentSpan = Array.from(spans).find(span => 
        span.getAttribute('data-index') === cursorPosition.toString()
      );
      
      if (currentSpan) {
        const rect = currentSpan.getBoundingClientRect();
        const parentRect = textRef.current.getBoundingClientRect();
        const newLeft = rect.left - parentRect.left;
        setCursorLeft(newLeft);
      }
    }
  };

  useEffect(() => {
    updateCursorPosition();
  }, [cursorPosition]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateCursorPosition();
    });

    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  handleClickRef.current = (letter: string) => {
    if (letter === "Backspace") {
      const currentWordBoundary = wordBoundaries[currentWordIndex];
      console.log(currentWordIndex);
      const extras = extraLetters[currentWordIndex] || [];
      
      if (extras.length > 0) {
        // si lettres supplémentaire au mots les suppprimer d'abords
        const newExtras = {...extraLetters};
        newExtras[currentWordIndex] = extras.slice(0, -1);
        setExtraLetters(newExtras);
      } else if (cursorPosition > currentWordBoundary.start) {
        setCursorPosition(prev => prev - 1);
      } else if(currentWordIndex > 0) {

        const previousWordIndex = currentWordIndex - 1; 
        const previousExtras = extraLetters[previousWordIndex] || [];
        const previousWordEnd = wordBoundaries[previousWordIndex].end;

        setCurrentWordIndex(previousWordIndex);
        setCursorPosition(previousWordEnd + previousExtras.length);
      }
    } else if (letter === " ") {
      if (cursorPosition > wordBoundaries[currentWordIndex].start) {
        const nextWordIndex = currentWordIndex + 1;
        if (nextWordIndex < wordBoundaries.length) {
          setCurrentWordIndex(nextWordIndex);
          setCursorPosition(wordBoundaries[nextWordIndex].start);
        }
      }
    } else if (letter.length === 1) {
      const currentWordBoundary = wordBoundaries[currentWordIndex];
      if (cursorPosition >= currentWordBoundary.end) {
        const newExtras = {...extraLetters};
        const currentExtras = extraLetters[currentWordIndex] || [];
        newExtras[currentWordIndex] = [...currentExtras, letter];
        setExtraLetters(newExtras);
      } else {
        if (letter !== text[cursorPosition]) {
          setMistakes(prev => new Set(prev).add(cursorPosition));
        }
        setCursorPosition(prev => prev + 1);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      handleClickRef.current(event.key);
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const theme = useTheme();

  const wordsCount = text.split(' ').length;
  const correctWords = currentWordIndex - skippedWords.size - 
    Array.from(mistakes).filter(pos => pos < cursorPosition).length;

  const renderWord = (word: string, wordIndex: number) => {
    const boundary = wordBoundaries[wordIndex];
    const wordExtra = extraLetters[wordIndex] || [];
    
    return (
      <span key={wordIndex} className="relative">
        {word.split('').map((char, charIndex) => {
          const absoluteIndex = boundary.start + charIndex;
          let className = "transition-colors duration-150 ";
          
          if (absoluteIndex < cursorPosition) {
            if (mistakes.has(absoluteIndex)) {
              className += "text-red-500 dark:text-red-400 ";
            } else {
              className += "text-green-500 dark:text-green-400 ";
            }
          } else {
            className += "text-gray-400 dark:text-gray-500 ";
          }

          return (
            <span 
              key={charIndex} 
              className={className}
              data-index={absoluteIndex}
            >
              {char}
            </span>
          );
        })}
        {wordExtra.map((extra, idx) => (
          <span 
            key={`extra-${idx}`}
            className="text-red-500 dark:text-red-400"
            data-index={boundary.end + idx}
          >
            {extra}
          </span>
        ))}
        {wordIndex < wordBoundaries.length - 1 && (
          <span className={
            boundary.end < cursorPosition 
              ? "text-green-500 dark:text-green-400"
              : "text-gray-400 dark:text-gray-500"
          }> </span>
        )}
      </span>
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <style jsx global>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
        <p ref={textRef} className="text-2xl font-mono mb-4 leading-loose relative">
          <span 
            className="absolute top-0 w-[2px] h-[1.2em] bg-blue-500 animate-[blink_1s_infinite]"
            style={{
              left: `${cursorLeft}px`,
              transition: 'left 0.1s ease-out'
            }}
          />
          {text.split(' ').map((word, index) => renderWord(word, index))}
        </p>
        
        <div className="mt-4 text-gray-600 dark:text-gray-300">
          <p>Position : {cursorPosition} / {text.length}</p>
          <p>Mot actuel : {currentWordIndex + 1} / {wordsCount}</p>
          <p>Mots corrects : {correctWords}</p>
          <p>Mots sautés : {skippedWords.size}</p>
          <p>Erreurs : {mistakes.size}</p>
        </div>
      </div>
    </div>
  );
};

export default TestGame;

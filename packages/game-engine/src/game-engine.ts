import { Stats } from "./stats";

class GameEngine {
  private static instance: GameEngine;
  public buffer: string[];
  public gameBuffer: string[];
  public cursor: number;
  public stats: Stats;

  public wordIndex: number;
  public cursorWordIndex: number;

  private constructor(buffer: string[]) {
    this.buffer = buffer;
    this.gameBuffer = [];
    this.cursor = 0;
    this.stats = new Stats();

    this.wordIndex = 0;
    this.cursorWordIndex = 0;
  }

  public static getInstance(buffer?: string[]): GameEngine {
    if (!GameEngine.instance && buffer) {
      GameEngine.instance = new GameEngine(buffer);
    }

    return GameEngine.instance;
  }

  public bufferToString(): string {
    return this.buffer.join(" ");
  }

  public gameBufferToString(): string {
    return this.gameBuffer.join(" ");
  }

  public handleKeyStroke(key: string): void {
    if (this.isFinished()) {
      return; // Game is over, do nothing
    }

    if (key === " ") {
      if (this.cursorWordIndex === 0) {
        console.error("cant skip word at the beginning");
        return;
      }

      this.wordIndex++
      this.cursorWordIndex = 0;
      this.gameBuffer[this.wordIndex] = "";
      // this.printDebug();

    } else if (key === "Backspace") {
      // this.printDebug()

      if (this.isAtBeginningOfWord() && this.isPreviousWordRight()) {
        console.info("cannot go back because the previous is right");
        return;
      }

      if (this.isAtBeginningOfWord()) {
        if (this.gameBuffer[this.wordIndex - 1]) {
          this.cursorWordIndex = this.gameBuffer[this.wordIndex - 1]!.length;
        } else {
          this.cursorWordIndex = 0;
          console.info("we should be at the very beginning of the sentence");
          console.error("not on a word atm");
        }
        this.gameBuffer.pop();
        this.wordIndex && this.wordIndex--;
        this.cursor && this.cursor--;
      } else {
        if (!this.gameBuffer[this.wordIndex]) {
          throw new Error("should never happen this is a bug");
        }
        //@ts-ignore
        this.gameBuffer[this.wordIndex] = this.gameBuffer[this.wordIndex]?.slice(0, -1);
        this.cursor && this.cursor--;
        this.cursorWordIndex && this.cursorWordIndex--;
      }

      // this.printDebug();

    } else if (key.length === 1 && !key.includes('Control') && !key.includes('Alt')) {
      if (!this.stats.isStarted()) {
        this.stats.start();
      }

      const targetChar = this.buffer[this.wordIndex]?.[this.cursorWordIndex];
      this.stats.logKeystroke(key === targetChar);

      this.gameBuffer[this.wordIndex] = (this.gameBuffer[this.wordIndex] || "") + key

      this.cursor++
      this.cursorWordIndex++;

      if (this.isFinished()) {
        this.stats.end();
      }
    } else {
      console.error("wrong key clicked : ", key);
    }
  }

  private isPreviousWordRight(): boolean {
    if (this.wordIndex === 0) return false;
    return this.gameBuffer[this.wordIndex - 1] === this.buffer[this.wordIndex - 1];
  }

  public getLetterState(wordIndex: number, charIndex: number): { typed: boolean; correct: boolean } {
    const typedWord = this.gameBuffer[wordIndex];
    const targetWord = this.buffer[wordIndex];

    const typed = typedWord !== undefined && charIndex < typedWord.length;
    if (!typed) {
      return { typed: false, correct: false };
    }

    const correct = targetWord !== undefined && targetWord[charIndex] === typedWord[charIndex];
    return { typed: true, correct: correct };
  }

  public getWordState(wordIndex: number): 'correct' | 'incorrect' | 'untyped' {
    if (wordIndex >= this.wordIndex) {
      return 'untyped';
    }

    const targetWord = this.buffer[wordIndex];
    const typedWord = this.gameBuffer[wordIndex];

    if (!typedWord) {
      return 'incorrect';
    }

    return targetWord === typedWord ? 'correct' : 'incorrect';
  }

  private isAtBeginningOfWord(): boolean {
    return !this.cursorWordIndex;
  }

  public printDebug(): void {
    console.log("\x1b[36mbuffer : \x1b[0m", this.buffer);
    console.log("\x1b[36mgameBuffer: \x1b[0m", this.gameBuffer);
    console.log("\x1b[36mcursor : \x1b[0m", this.cursor);
    console.log("\x1b[36mcursor word index: \x1b[0m", this.cursorWordIndex);
    console.log("\x1b[36mword index: \x1b[0m", this.wordIndex);
  }

  public isFinished(): boolean {
    const lastWordIndex = this.buffer.length - 1;
    if (this.wordIndex !== lastWordIndex) {
      return false;
    }
    const lastWord = this.buffer[lastWordIndex];
    const lastTypedWord = this.gameBuffer[lastWordIndex];
    return lastWord === lastTypedWord;
  }

  public reset(): void {
    this.gameBuffer = [];
    this.cursor = 0;
    this.wordIndex = 0;
    this.cursorWordIndex = 0;
    this.stats.reset();
  }
}

export default GameEngine;

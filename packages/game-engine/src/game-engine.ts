class GameEngine {
  private static instance: GameEngine;
  private buffer: string[];
  public gameBuffer: string[];
  public cursor: number;

  public wordIndex: number;
  public cursorWordIndex: number;

  private constructor(buffer: string[]) {
    this.buffer = buffer;
    this.gameBuffer = [];
    this.cursor = 0;

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
    console.log(key);
    if (key === " ") {
      if (this.cursorWordIndex === 0) {
        console.error("cant skip word at the beginning");
        return;
      }

      this.wordIndex++
      this.cursorWordIndex = 0;
      this.gameBuffer[this.wordIndex] = "";
      console.log("previous is : ", this.isPreviousWordRight());
      this.printDebug();

    } else if (key === "Backspace") {
      console.log("before : ");
      this.printDebug()

      if (this.isAtBeginningOfWord() && this.isPreviousWordRight()) {
        console.info("cannot go back because the previous is right");
        return;
      }

      // on fait retour a la premiere lettre d'un mot
      // donc on jump back un mot dans l'array
      if (this.isAtBeginningOfWord()) {

        // set the cursorWordIndex to the end of the last word 
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
        // Should always have a this.gameBuffer[this.wordIndex] in here
        //@ts-ignore
        this.gameBuffer[this.wordIndex] = this.gameBuffer[this.wordIndex]?.slice(0, -1);
        this.cursor && this.cursor--;
        this.cursorWordIndex && this.cursorWordIndex--;
      }

      console.log("after : ");
      this.printDebug();

    } else if (key.length === 1 && !key.includes('Control') && !key.includes('Alt')) {
      console.log("right key clicked : ", key)


      // append the new char to the current gameBuffer at the right wordIndex
      this.gameBuffer[this.wordIndex] = (this.gameBuffer[this.wordIndex] || "") + key

      this.cursor++
      this.cursorWordIndex++;
      console.log(this.gameBuffer);
      console.log(this.cursorWordIndex);



    } else {
      console.error("wrong key clicked : ", key);
    }
    console.log("previouus right :", this.isPreviousWordRight());
    // this.printDebug();
  }

  private isPreviousWordRight(): boolean {
    if (this.wordIndex === 0) return false;
    return this.gameBuffer[this.wordIndex - 1] === this.buffer[this.wordIndex - 1];
  }


  private isAtBeginningOfWord(): boolean {
    return !this.cursorWordIndex;
  }

  public printDebug(): void {
    console.log("[36mbuffer : [0m", this.buffer);
    console.log("[36mgameBuffer: [0m", this.gameBuffer);
    console.log("[36mcursor : [0m", this.cursor);
    console.log("[36mcursor word index: [0m", this.cursorWordIndex);
    console.log("[36mword index: [0m", this.wordIndex);
  }
}

export default GameEngine;

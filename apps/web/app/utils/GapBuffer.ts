class GapBuffer {

  private bufferSize: number;
  public buffer: string[] | null[] = [];
  public gapStart: number;
  public gapEnd: number;
  public cursor: number;

  constructor(bufferSize = 20) {
    this.buffer = new Array(bufferSize).fill(null);
    this.bufferSize = bufferSize;
    this.gapStart = 0;
    this.gapEnd = bufferSize;
    this.cursor = 0;
  }

  public moveGapToCursor() {
    if (this.cursor === this.gapStart) return;

    if (this.cursor < this.gapStart) {
      const moveCount = this.gapStart - this.cursor;

      // exemple:
      // gs = 3; cursor = 1; moveCount == 2
      // loop sur les 2 index (moveCount)
      for (let i = 0; i < moveCount; i++) {
        this.buffer[this.gapEnd - 1 - i] = this.buffer[this.gapEnd - 1 - i]!;
        this.buffer[this.gapStart - 1 - i] = null;
      }
      this.gapStart -= moveCount;
      this.gapEnd -= moveCount;

    } else {
      const moveCount = this.cursor - this.gapStart;

      for (let i = 0; i < moveCount; i++) {
        this.buffer[this.gapStart + i] = this.buffer[this.gapEnd + i]!;
        this.buffer[this.gapEnd + i] = null;
      }

      this.gapStart += moveCount;
      this.gapEnd += moveCount;
    }
  }

  private ExpandBufferIfNeeded() {
    if (this.gapStart === this.gapEnd) {
      const newSize = this.buffer.length * 2;
      const newBuffer = new Array(newSize).fill(null);

      for (let i = 0; i < this.gapStart; i++) {
        newBuffer[i] = this.buffer[i];
      }

      const afterGapSize = this.buffer.length - this.gapEnd;
      for (let i = 0; i < afterGapSize; i++) {
        newBuffer[newSize - afterGapSize + i] = this.buffer[this.gapEnd + i];
      }

      this.buffer = newBuffer;
      this.gapEnd = newSize - afterGapSize;
    }
  }

  private length(): number {
    return this.buffer.length - (this.gapEnd - this.gapStart);
  }

  public insertChar(char: string): void {
    this.moveGapToCursor();
    this.ExpandBufferIfNeeded();

    this.buffer[this.gapStart] = char;

    this.gapStart++;
    this.cursor++;
  }

  public deleteBackWard(): boolean {
    if (this.cursor === this.length()) return false;

    this.moveGapToCursor();
    this.gapStart--;
    this.cursor--;
    this.buffer[this.gapStart] = null;
    this.gapEnd++;
    return true;
  }

  public deleteForward(): boolean {
    if (this.cursor === this.length()) return false;

    this.moveGapToCursor();
    this.buffer[this.gapEnd] = null;
    this.gapEnd++;
    return true;
  }

  public moveCursor(newPosition: number): void {
    this.cursor = Math.max(0, Math.min(newPosition, this.length()));
  }

  public toString() {
    let result = '';

    for (let i = 0; i < this.gapStart; i++) {
      result += this.buffer[i] || '';
    }

    for (let i = this.gapEnd; i < this.buffer.length; i++) {
      result += this.buffer[i] || '';
    }
    return result;
  }

  public clear(): void {
    this.buffer = new Array(this.bufferSize).fill(null);
    this.gapStart = 0;
    this.gapEnd = this.buffer.length;
    this.cursor = 0;
  }
}

export default GapBuffer;

export class Stats {
  private startTime: number | null = null;
  private endTime: number | null = null;
  private correctKeystrokes = 0;
  private incorrectKeystrokes = 0;

  public start(): void {
    if (this.startTime === null) {
      this.startTime = Date.now();
    }
  }

  public end(): void {
    if (this.endTime === null) {
        this.endTime = Date.now();
    }
  }

  public isStarted(): boolean {
    return this.startTime !== null;
  }

  public logKeystroke(correct: boolean): void {
    if (correct) {
      this.correctKeystrokes++;
    } else {
      this.incorrectKeystrokes++;
    }
  }

  public getWPM(): number {
    if (!this.startTime) {
      return 0;
    }
    const now = this.endTime || Date.now();
    const durationInMinutes = (now - this.startTime) / 60000;

    if (durationInMinutes < 0.01) { // Avoid artificially high WPM on the first few chars
        return 0;
    }

    // The standard definition of a word is 5 characters
    const totalChars = this.correctKeystrokes + this.incorrectKeystrokes;
    const wordCount = totalChars / 5;
    return Math.round(wordCount / durationInMinutes);
  }

  public getAccuracy(): number {
    const totalKeystrokes = this.correctKeystrokes + this.incorrectKeystrokes;
    if (totalKeystrokes === 0) {
      return 100;
    }
    return Math.round((this.correctKeystrokes / totalKeystrokes) * 100);
  }

  public reset(): void {
    this.startTime = null;
    this.endTime = null;
    this.correctKeystrokes = 0;
    this.incorrectKeystrokes = 0;
  }
}
import GameEngine from "../src/game-engine"

describe('GameEngine Backspace', () => {
  let gameEngine: GameEngine;
  const buffer = ['hello', 'world'];

  beforeEach(() => {
    // Reset the singleton instance before each test
    // @ts-ignore
    GameEngine.instance = undefined;
    gameEngine = GameEngine.getInstance(buffer);
  });

  it('should delete the last character of the current word', () => {
    gameEngine.handleKeyStroke('h');
    gameEngine.handleKeyStroke('e');
    expect(gameEngine.gameBuffer[0]).toBe('he');
    gameEngine.handleKeyStroke('Backspace');
    expect(gameEngine.gameBuffer[0]).toBe('h');
    expect(gameEngine.cursor).toBe(1);
    expect(gameEngine.cursorWordIndex).toBe(1);
  });

  it('should not do anything if backspace is pressed at the very beginning', () => {
    const initialState = {
      gameBuffer: [],
      cursor: 0,
      wordIndex: 0,
      cursorWordIndex: 0,
    };
    gameEngine.handleKeyStroke('Backspace');
    expect(gameEngine.gameBuffer).toEqual(initialState.gameBuffer);
    expect(gameEngine.cursor).toBe(initialState.cursor);
    expect(gameEngine.wordIndex).toBe(initialState.wordIndex);
    expect(gameEngine.cursorWordIndex).toBe(initialState.cursorWordIndex);
  });

  it('should move to the previous word if backspace is pressed at the beginning of a word (and previous is incorrect)', () => {
    // Type "helo " (incorrect)
    'helo '.split('').forEach(char => gameEngine.handleKeyStroke(char));
    // Type "w"
    gameEngine.handleKeyStroke('w');

    expect(gameEngine.wordIndex).toBe(1);
    expect(gameEngine.gameBuffer[1]).toBe('w');

    // Delete "w"
    gameEngine.handleKeyStroke('Backspace');
    expect(gameEngine.gameBuffer[1]).toBe('');
    //@ts-ignore
    expect(gameEngine.isAtBeginningOfWord()).toBe(true);

    // Jump to previous word
    gameEngine.handleKeyStroke('Backspace');
    expect(gameEngine.wordIndex).toBe(0);
    expect(gameEngine.cursorWordIndex).toBe(4); // length of 'helo'
    expect(gameEngine.gameBuffer.length).toBe(1);
    expect(gameEngine.gameBuffer[0]).toBe('helo');
  });

  it('should NOT move to the previous word if it is correct', () => {
    // Type "hello " (which is correct)
    'hello '.split('').forEach(char => gameEngine.handleKeyStroke(char));

    expect(gameEngine.wordIndex).toBe(1);
    //@ts-ignore
    expect(gameEngine.isAtBeginningOfWord()).toBe(true);

    // Try to go back
    gameEngine.handleKeyStroke('Backspace');

    // State should not have changed
    expect(gameEngine.wordIndex).toBe(1);
    expect(gameEngine.cursorWordIndex).toBe(0);
    expect(gameEngine.gameBuffer[0]).toBe('hello');
    expect(gameEngine.gameBuffer[1]).toBe('');
  });

  it('should move to the previous word if it is incorrect', () => {
    // Type "helllo " (incorrect)
    'helllo '.split('').forEach(char => gameEngine.handleKeyStroke(char));

    expect(gameEngine.wordIndex).toBe(1);
    //@ts-ignore
    expect(gameEngine.isAtBeginningOfWord()).toBe(true);

    // Go back
    gameEngine.handleKeyStroke('Backspace');

    // State should have changed
    expect(gameEngine.wordIndex).toBe(0);
    expect(gameEngine.cursorWordIndex).toBe(6); // length of 'helllo'
    expect(gameEngine.gameBuffer.length).toBe(1);
    expect(gameEngine.gameBuffer[0]).toBe('helllo');
  });

  it('should not move to the previous word if backspace is pressed at the beginning of a word and the previous word is correct', () => {
    // Type "hello " (correct)
    'hello '.split('').forEach(char => gameEngine.handleKeyStroke(char));
    // Type "w"
    gameEngine.handleKeyStroke('w');

    expect(gameEngine.wordIndex).toBe(1);
    expect(gameEngine.gameBuffer[1]).toBe('w');

    // Delete "w"
    gameEngine.handleKeyStroke('Backspace');
    expect(gameEngine.gameBuffer[1]).toBe('');

    //@ts-ignore
    expect(gameEngine.isAtBeginningOfWord()).toBe(true);

    // Try to jump to previous word
    gameEngine.handleKeyStroke('Backspace');
    expect(gameEngine.wordIndex).toBe(1);
    expect(gameEngine.cursorWordIndex).toBe(0);
    expect(gameEngine.gameBuffer.length).toBe(2);
    expect(gameEngine.gameBuffer[0]).toBe('hello');
    expect(gameEngine.gameBuffer[1]).toBe('');
  });

  it('should handle multiple backspaces correctly across words', () => {
    // Type "hello worl"
    'hello '.split('').forEach(char => gameEngine.handleKeyStroke(char));
    'worl'.split('').forEach(char => gameEngine.handleKeyStroke(char));

    expect(gameEngine.gameBuffer).toEqual(['hello', 'worl']);

    // Backspace 4 times to delete "worl"
    for (let i = 0; i < 4; i++) {
      gameEngine.handleKeyStroke('Backspace');
    }

    expect(gameEngine.gameBuffer[1]).toBe('');
    expect(gameEngine.wordIndex).toBe(1);
    expect(gameEngine.cursorWordIndex).toBe(0);

    // Backspace to jump to previous word (which is correct, so it shouldn't work)
    gameEngine.handleKeyStroke('Backspace');
    expect(gameEngine.wordIndex).toBe(1);
    expect(gameEngine.cursorWordIndex).toBe(0);
    expect(gameEngine.gameBuffer[0]).toBe('hello');
  });
});

describe('GameEngine Keystrokes', () => {
  let gameEngine: GameEngine;
  const buffer = ['hello', 'world'];

  beforeEach(() => {
    // Reset the singleton instance before each test
    // @ts-ignore
    GameEngine.instance = undefined;
    gameEngine = GameEngine.getInstance(buffer);
  });

  it('should add a correct character to the game buffer', () => {
    gameEngine.handleKeyStroke('h');
    expect(gameEngine.gameBuffer[0]).toBe('h');
    expect(gameEngine.cursor).toBe(1);
    expect(gameEngine.cursorWordIndex).toBe(1);
  });

  it('should move to the next word when space is pressed', () => {
    'hello '.split('').forEach(char => gameEngine.handleKeyStroke(char));
    expect(gameEngine.wordIndex).toBe(1);
    expect(gameEngine.cursorWordIndex).toBe(0);
    expect(gameEngine.gameBuffer[0]).toBe('hello');
    expect(gameEngine.gameBuffer[1]).toBe('');
  });

  it('should handle typing a full correct word and then a space', () => {
    'hello'.split('').forEach(char => gameEngine.handleKeyStroke(char));
    gameEngine.handleKeyStroke(' ');
    expect(gameEngine.wordIndex).toBe(1);
    expect(gameEngine.gameBuffer).toEqual(['hello', '']);
  });

  it('should handle typing a full incorrect word and then a space', () => {
    'helo'.split('').forEach(char => gameEngine.handleKeyStroke(char));
    gameEngine.handleKeyStroke(' ');
    expect(gameEngine.wordIndex).toBe(1);
    expect(gameEngine.gameBuffer).toEqual(['helo', '']);
  });

  it('should allow typing after a correct word, making it incorrect', () => {
    'hello'.split('').forEach(char => gameEngine.handleKeyStroke(char));
    expect(gameEngine.gameBuffer[0]).toBe('hello');

    gameEngine.handleKeyStroke('a');
    expect(gameEngine.gameBuffer[0]).toBe('helloa');
  });

  it('should not move to the next word if space is pressed at the beginning of a word', () => {
    // Type "hello " to move to the next word.
    'hello '.split('').forEach(char => gameEngine.handleKeyStroke(char));
    expect(gameEngine.wordIndex).toBe(1);
    //@ts-ignore
    expect(gameEngine.isAtBeginningOfWord()).toBe(true);

    // Press space again
    gameEngine.handleKeyStroke(' ');

    // The state should not change
    expect(gameEngine.wordIndex).toBe(1);
    expect(gameEngine.cursorWordIndex).toBe(0);
  });
});

describe('GameEngine Utils', () => {
  let gameEngine: GameEngine;
  const buffer = ['hello', 'world'];

  beforeEach(() => {
    // @ts-ignore
    GameEngine.instance = undefined;
    gameEngine = GameEngine.getInstance(buffer);
  });

  it('isAtBeginningOfWord should return true at the beginning of a word', () => {
    //@ts-ignore
    expect(gameEngine.isAtBeginningOfWord()).toBe(true);
    gameEngine.handleKeyStroke('h');

    //@ts-ignore
    expect(gameEngine.isAtBeginningOfWord()).toBe(false);
  });

  it('isAtBeginningOfWord should return true after typing a word and a space', () => {
    'hello '.split('').forEach(char => gameEngine.handleKeyStroke(char));
    //@ts-ignore
    expect(gameEngine.isAtBeginningOfWord()).toBe(true);
  });

  it('isPreviousWordRight should return true if the previous word is correct', () => {
    'hello '.split('').forEach(char => gameEngine.handleKeyStroke(char));
    // @ts-ignore
    expect(gameEngine.isPreviousWordRight()).toBe(true);
  });

  it('isPreviousWordRight should return false if the previous word is incorrect', () => {
    'helo '.split('').forEach(char => gameEngine.handleKeyStroke(char));
    // @ts-ignore
    expect(gameEngine.isPreviousWordRight()).toBe(false);
  });

  it('isPreviousWordRight should return false for the first word', () => {
    // @ts-ignore
    expect(gameEngine.isPreviousWordRight()).toBe(false);
  });
});

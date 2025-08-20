import GapBuffer from '../app/utils/GapBuffer';

describe('GapBuffer', () => {
  it('should initialize correctly', () => {
    const gb = new GapBuffer();
    expect(gb.toString()).toBe('');
    expect(gb.cursor).toBe(0);
  });

  it('should insert characters', () => {
    const gb = new GapBuffer();
    gb.insertChar('a');
    gb.insertChar('b');
    gb.insertChar('c');
    expect(gb.toString()).toBe('abc');
    expect(gb.cursor).toBe(3);
  });

  it('should move the cursor', () => {
    const gb = new GapBuffer();
    gb.insertChar('a');
    gb.insertChar('b');
    gb.insertChar('c');
    gb.moveCursor(1);
    expect(gb.cursor).toBe(1);
    gb.insertChar('x');
    expect(gb.toString()).toBe('axbc');
  });

  it('should delete backward', () => {
    const gb = new GapBuffer();
    gb.insertChar('a');
    gb.insertChar('b');
    gb.insertChar('c');
    gb.moveCursor(3);
    gb.deleteBackWard();
    expect(gb.toString()).toBe('ab');
    expect(gb.cursor).toBe(2);
  });

  it('should delete forward', () => {
    const gb = new GapBuffer();
    gb.insertChar('a');
    gb.insertChar('b');
    gb.insertChar('c');
    gb.moveCursor(1);
    gb.deleteForward();
    expect(gb.toString()).toBe('ac');
  });

  it('should handle buffer expansion', () => {
    const gb = new GapBuffer(5);
    for (let i = 0; i < 10; i++) {
      gb.insertChar('a');
    }
    expect(gb.toString()).toBe('aaaaaaaaaa');
  });

  it('should clear the buffer', () => {
    const gb = new GapBuffer();
    gb.insertChar('a');
    gb.insertChar('b');
    gb.clear();
    expect(gb.toString()).toBe('');
    expect(gb.cursor).toBe(0);
  });
});

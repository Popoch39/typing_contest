import { Stats } from '../src/stats';

// Tell Jest to use fake timers
// jest.useFakeTimers();

describe('Stats', () => {
  let stats: Stats;

  beforeEach(() => {
    stats = new Stats();
  });

  it('should initialize with default values', () => {
    expect(stats.getWPM()).toBe(0);
    expect(stats.getAccuracy()).toBe(100);
    expect(stats.isStarted()).toBe(false);
  });

  it('should start the timer', () => {
    stats.start();
    expect(stats.isStarted()).toBe(true);
  });

  it('should reset all stats to initial state', () => {
    stats.start();
    stats.logKeystroke(true);
    stats.end();
    stats.reset();

    expect(stats.isStarted()).toBe(false);
    expect(stats.getAccuracy()).toBe(100);
    expect(stats.getWPM()).toBe(0);
  });

  describe('Accuracy Calculation', () => {
    it('should be 100% with only correct keystrokes', () => {
      stats.logKeystroke(true);
      stats.logKeystroke(true);
      expect(stats.getAccuracy()).toBe(100);
    });

    it('should be 0% with only incorrect keystrokes', () => {
      stats.logKeystroke(false);
      stats.logKeystroke(false);
      expect(stats.getAccuracy()).toBe(0);
    });

    it('should be 50% with one correct and one incorrect keystroke', () => {
      stats.logKeystroke(true);
      stats.logKeystroke(false);
      expect(stats.getAccuracy()).toBe(50);
    });
  });

  describe('WPM Calculation', () => {
    // it('should calculate WPM correctly over one minute', () => {
    //   stats.start();
    //   
    //   // Simulate typing 50 characters (10 standard words)
    //   for (let i = 0; i < 50; i++) {
    //     stats.logKeystroke(true);
    //   }
    //
    //   // Advance our fake timer by 60 seconds (1 minute)
    //   jest.advanceTimersByTime(60000);
    //   
    //   expect(stats.getWPM()).toBe(10);
    // });

    // it('should return 0 if less than a second has passed to avoid crazy values', () => {
    //     stats.start();
    //     stats.logKeystroke(true);
    //     jest.advanceTimersByTime(500); // half a second
    //     expect(stats.getWPM()).toBe(0);
    // });
  });
});

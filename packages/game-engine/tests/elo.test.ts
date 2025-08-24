
import { EloCalculator } from '../src/Elo/elo';

// The Player class is not exported, so we define it here for testing purposes.
// This is based on the usage in the EloCalculator constructor.
class Player {
  constructor(public rating: number) {}
}

describe('EloCalculator', () => {
  it('should calculate correct win/loss probabilities for different ratings', () => {
    const playerA = new Player(1400);
    const playerB = new Player(1000);
    const elo = new EloCalculator(playerA, playerB);

    const gains = elo.calculatePoints();

    expect(gains.playerA.wins).toBeCloseTo(2.9, 1);
    expect(gains.playerB.wins).toBeCloseTo(29.1, 1);
  });

  it('should calculate expected gains correctly', () => {
    const playerA = new Player(1200);
    const playerB = new Player(1200);
    const elo = new EloCalculator(playerA, playerB);

    const expectedGains = elo.calculatePoints();

    expect(expectedGains.playerA.wins).toBeCloseTo(16);
    expect(expectedGains.playerA.loses).toBeCloseTo(-16);
    expect(expectedGains.playerB.wins).toBeCloseTo(16);
    expect(expectedGains.playerB.loses).toBeCloseTo(-16);
  });

  it('should use the K factor correctly', () => {
    const playerA = new Player(1200);
    const playerB = new Player(1200);
    const elo = new EloCalculator(playerA, playerB, 16); // Using a K factor of 16

    const expectedGains = elo.calculatePoints();

    expect(expectedGains.playerA.wins).toBeCloseTo(8);
    expect(expectedGains.playerA.loses).toBeCloseTo(-8);
    expect(expectedGains.playerB.wins).toBeCloseTo(8);
    expect(expectedGains.playerB.loses).toBeCloseTo(-8);
  });

  it('should update ratings correctly after a match', () => {
    const playerA = new Player(1200);
    const playerB = new Player(1200);
    const elo = new EloCalculator(playerA, playerB);

    // Simulate player A winning
    const expectedGains = elo.calculatePoints();
    playerA.rating += expectedGains.playerA.wins;
    playerB.rating += expectedGains.playerB.loses;


    expect(playerA.rating).toBeCloseTo(1216);
    expect(playerB.rating).toBeCloseTo(1184);
  });
});

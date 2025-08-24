import { expectedGainType, expectedGainTypeReturn } from "./elo-types";
import { Player } from "./player";

export class EloCalculator {
  private K: number = 32;
  private ra: number;
  private rb: number;

  constructor(playerA: Player, playerB: Player, K?: number) {
    this.ra = playerA.rating;
    this.rb = playerB.rating;
    if (K) {
      this.K = K;
    }
  }

  private probalilityToWin(
    ratingA: number,
    ratingB: number
  ): number {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  }

  public calculatePoints(): expectedGainTypeReturn {
    const probalityA = this.probalilityToWin(this.ra, this.rb);
    const probalityB = this.probalilityToWin(this.rb, this.ra);

    const expectedGainA: expectedGainType = {
      wins: this.K * (1 - probalityA),
      loses: this.K * (0 - probalityA),
    };

    const expectedGainB: expectedGainType = {
      wins: this.K * (1 - probalityB),
      loses: this.K * (0 - probalityB),
    };

    return {
      playerA: expectedGainA,
      playerB: expectedGainB,
    };
  }
}

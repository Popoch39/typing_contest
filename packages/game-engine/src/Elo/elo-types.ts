export type User = {
  firstName: string;
  lastName: string;
  age: number;
};

export type expectedGainType = {
  wins: number;
  loses: number;
};

export type expectedGainTypeReturn = {
  playerA: expectedGainType;
  playerB: expectedGainType;
};

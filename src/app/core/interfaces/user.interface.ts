export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  gamesPlayed: number;
  gamesWon: {
    easy: number;
    medium: number;
    hard: number;
  };
  successRate: number;
}

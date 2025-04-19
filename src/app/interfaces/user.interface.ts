export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  gamesPlayed: number;
  gamesWon: number;
  successRate: number;
  easyGamesWon: number;
  mediumGamesWon: number;
  hardGamesWon: number;
}

export interface User {
  id: string;
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

import { User } from './user.interface';

export interface Competition {
  id: number;
  difficulty: string;
  startDate: string;
  players: string[];
  sudoku: [][];
  privacity: string;
  maxPlayers: number;
  joinCode: string;
}

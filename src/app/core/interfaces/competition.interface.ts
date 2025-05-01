import { User } from './user.interface';

export interface Competition {
  id: number;
  difficulty: string;
  startDate: string;
  participants: string[];
  sudoku: [][];
  privacity: string;
  maxPlayers: number;
  joinCode: string;
}

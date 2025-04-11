export interface Competition {
  id: number;
  difficulty: string;
  startDate: string;
  participants: [];
  sudoku: [][];
  privacity: string;
  maxPlayers: number
  joinCode: string
}

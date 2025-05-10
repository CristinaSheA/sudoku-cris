import { inject, Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { BehaviorSubject, Subject } from 'rxjs';
import { Difficulty } from '../../../core/enums/difficulty.enum';
import { UserService } from '../../users/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class SudokuService {
  private readonly usersService = inject(UserService);
  public selectedCell: { row: number; col: number } | null = null;
  public tableUpdated: Subject<void> = new Subject<void>();
  public difficulty: Difficulty = Difficulty.Easy;
  public table: number[][] = [];
  public mistakes$: BehaviorSubject<number> = new BehaviorSubject(0);

  public generateSudoku(difficulty: Difficulty) {
    this.table = Array.from({ length: 9 }, () => Array(9).fill(0));
    this.fillSudoku();
    this.removeNumbers(difficulty);
    return this.table;
  }
  public canPlaceNumber(
    row: number,
    col: number,
    number: number | null
  ): boolean | undefined {
    if (number === null || number === undefined) {
      return false;
    }

    if (number > 9 || number <= 0) {
      if (!this.selectedCell) return false;
      this.alerts(1);
      return false;
    }

    for (let i = 0; i < 9; i++) {
      if (this.table[row][i] === number || this.table[i][col] === number) {
        if (!this.selectedCell) return false;
        this.alerts(2);
        return false;
      }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (this.table[i][j] === number) {
          if (!this.selectedCell) return false;
          this.alerts(2);
          return false;
        }
      }
    }

    return true;
  }
  public fillSudoku(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.table[row][col] === 0) {
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          this.shuffleArray(numbers);
          for (let num of numbers) {
            if (this.canPlaceNumber(row, col, num)) {
              this.table[row][col] = num;
              if (this.fillSudoku()) {
                return true;
              }
              this.table[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  public completeSudoku(difficulty: Difficulty): void {
    const isComplete = this.table.every((row) =>
      row.every((cell) => cell !== 0)
    );
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) {
      console.error('User ID not found');
      return;
    }
    const user = this.usersService.users.find((u) => u.id === currentUserId);
    if (!user) {
      console.error('User not found');
      return;
    }
    user.gamesPlayed += 1;

    if (isComplete) {
      switch (difficulty) {
        case Difficulty.Easy:
          user.gamesWon.easy += 1;
          break;
        case Difficulty.Medium:
          user.gamesWon.medium += 1;
          break;
        case Difficulty.Hard:
          user.gamesWon.hard += 1;
          break;
      }
      const totalWins =
        user.gamesWon.easy + user.gamesWon.medium + user.gamesWon.hard;
      user.successRate = parseFloat(
        ((totalWins / user.gamesPlayed) * 100).toFixed(2)
      );
      this.alerts(3);
    }
    this.usersService.updateUser(user).catch((error) => {
      console.error('Failed to update user stats:', error);
    });
  }
  public hint(): void {
    let randomRowIndex = Math.floor(Math.random() * this.table.length);
    let randomRow = this.table[randomRowIndex];
    let emptyCellIndices = randomRow
      .map((cell, index) => (cell === 0 ? index : -1))
      .filter((index) => index !== -1);
    if (emptyCellIndices.length === 0) {
      return;
    }
    let randomCellIndex =
      emptyCellIndices[Math.floor(Math.random() * emptyCellIndices.length)];

    for (let num = 1; num <= 9; num++) {
      if (this.canPlaceNumber(randomRowIndex, randomCellIndex, num)) {
        randomRow[randomCellIndex] = num;
        break;
      }
    }
  }
  public regenerateSudoku() {
    this.generateSudoku(this.difficulty);
    this.tableUpdated.next();
  }
  private alerts(error: number): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    const Toast2 = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    switch (error) {
      case 1:
        this.mistakes$.next(this.mistakes$.value + 1);
        Toast.fire({
          icon: 'error',
          title: 'You can use only numbers from 1 to 9.',
        });
        break;
      case 2:
        this.mistakes$.next(this.mistakes$.value + 1);
        Toast.fire({
          icon: 'error',
          title:
            'Each number in the 3x3 block, vertical column or horizontal row can be used only once.',
        });
        break;
      case 3:
        Toast.fire({
          icon: 'success',
          title: 'You completed the sudoku, congratulations!',
        });
        break;
    }
    if (this.mistakes$.value === 3) {
      Swal.fire({
        icon: 'error',
        title: 'Game Over',
        text: 'Has cometido 3 errores. La partida termina.',
      }).then(() => {
        this.mistakes$.next(0);
        this.regenerateSudoku();
      });
    }
  }
  private shuffleArray(array: number[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  private countSolutions(): number {
    let solutions = 0;

    const solve = (board: number[][]): boolean => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (this.canPlaceNumber(row, col, num)) {
                board[row][col] = num;
                if (solve(board)) {
                  solutions++;
                }
                board[row][col] = 0;
                if (solutions > 1) return false;
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    solve(this.table);
    return solutions;
  }
  private removeNumbers(difficulty: Difficulty): void {
    let numCellsToRemove: number;
    switch (difficulty) {
      case Difficulty.Easy:
        numCellsToRemove = 35;
        break;
      case Difficulty.Medium:
        numCellsToRemove = 43;
        break;
      case Difficulty.Hard:
        numCellsToRemove = 50;
        break;
      default:
        numCellsToRemove = 0;
    }

    const originalTable = JSON.parse(JSON.stringify(this.table));

    for (let i = 0; i < numCellsToRemove; ) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (originalTable[row][col] !== 0) {
        this.table[row][col] = 0;
        const solutions = this.countSolutions();

        if (solutions === 1) {
          i++;
        } else {
          this.table[row][col] = originalTable[row][col];
        }
      }
    }
  }
}

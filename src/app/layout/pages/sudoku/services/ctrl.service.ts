import { ChangeDetectorRef, inject, Injectable } from '@angular/core';
import { SudokuService } from './sudoku.service';

@Injectable({
  providedIn: 'root'
})
export class CtrlService {
  public readonly sudokuService: SudokuService = inject(SudokuService);

  public hint(): void {
    let randomRowIndex = Math.floor(
      Math.random() * this.sudokuService.table.length
    );
    let randomRow = this.sudokuService.table[randomRowIndex];
    let emptyCellIndices = randomRow
      .map((cell, index) => (cell === 0 ? index : -1))
      .filter((index) => index !== -1);
    if (emptyCellIndices.length === 0) {
      console.log('No hay celdas vacías en la fila seleccionada.');
      return;
    }
    let randomCellIndex =
      emptyCellIndices[Math.floor(Math.random() * emptyCellIndices.length)];

    for (let num = 1; num <= 9; num++) {
      if (
        this.sudokuService.canPlaceNumber(
          randomRowIndex,
          randomCellIndex,
          num
        )
      ) {
        randomRow[randomCellIndex] = num;
        break;
      }
    }
  }
  public regenerateSudoku() {
    this.sudokuService.generateSudoku(this.sudokuService.difficulty);
    this.sudokuService.tableUpdated.next();
  }
}

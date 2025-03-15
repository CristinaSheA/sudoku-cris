import { ChangeDetectorRef, inject, Injectable } from '@angular/core';
import { SudokuService } from './sudoku.service';

@Injectable({
  providedIn: 'root'
})
export class CtrlService {
  public readonly sudokuService: SudokuService = inject(SudokuService);
  private readonly THEME_KEY = 'theme';
  private readonly DARK_THEME = 'dark';
  private readonly LIGHT_THEME = 'light';

  constructor() {
    const savedTheme = localStorage.getItem(this.THEME_KEY) || this.LIGHT_THEME;
    this.setTheme(savedTheme);
  }

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
  public setTheme(theme: string) {
    document.body.classList.remove(this.DARK_THEME, this.LIGHT_THEME);
    document.body.classList.add(theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }
  public isDarkTheme(): boolean {
    return localStorage.getItem(this.THEME_KEY) === this.DARK_THEME;
  }
  private toggleTheme() {
    const currentTheme = localStorage.getItem(this.THEME_KEY) || this.LIGHT_THEME;
    const newTheme = currentTheme === this.LIGHT_THEME ? this.DARK_THEME : this.LIGHT_THEME;
    this.setTheme(newTheme);
  }

}

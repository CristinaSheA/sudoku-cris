import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { SudokuService } from '../../../../services/sudoku.service';
import { Difficulty } from '../../../../enums/difficulty.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sudoku-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  private readonly sudokuService: SudokuService = inject(SudokuService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  public table: any = this.sudokuService.table;
  private tableUpdatedSubscription!: Subscription;

  ngOnInit() {
    this.tableUpdatedSubscription = this.sudokuService.tableUpdated.subscribe(
      () => {
        this.refreshTable();
      }
    );
    this.sudokuService.generateSudoku(Difficulty.Easy);
  }
  ngOnDestroy() {
    this.tableUpdatedSubscription.unsubscribe();
  }

  public selectCell(row: number, col: number): void {
    this.sudokuService.selectedCell = { row, col };
    const inputElement = document.querySelector(
      `td[row="${row}"][col="${col}"] input`
    );
    if (inputElement) {
      (inputElement as HTMLInputElement).focus();
    }
  }
  public saveNewNumber(row: number, col: number, event: any | null): void {
    if (this.selectCell === null) return;
    const inputValue = event.target.value;
    if (inputValue === '') return;

    const parsedValue = parseInt(inputValue, 10);
    if (isNaN(parsedValue)) {
      event.target.value = '';
      return;
    }

    if (!this.sudokuService.canPlaceNumber(row, col, parsedValue)) {
      console.log('Cannot place number');
      this.sudokuService.mistakes += 1;
      return;
    }

    this.table[row][col] = parsedValue;

    const isComplete = this.table.every((row: number[]) =>
      row.every((cell) => cell !== 0)
    );

    if (isComplete) {
      this.sudokuService.completeSudoku();
    }

    this.cdr.markForCheck();
    this.sudokuService.selectedCell = null;

    const inputElement = document.querySelector(
      `td[row="${row}"][col="${col}"] input`
    );
    if (inputElement) {
      (inputElement as HTMLInputElement).focus();
    }
  }

  @HostListener('document:click', ['$event'])
  private onClick(event: MouseEvent): void {
    const inputElement = document.querySelector('input');
    if (inputElement && !inputElement.contains(event.target as Node)) {
      this.sudokuService.selectedCell = null;
      console.log('dsds');
    }
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (!this.sudokuService.selectedCell) return;
      const inputElement = document.querySelector(
        `td[row="${this.sudokuService.selectedCell.row}"][col="${this.sudokuService.selectedCell.col}"] input`
      );
      if (inputElement) {
        this.saveNewNumber(
          this.sudokuService.selectedCell.row,
          this.sudokuService.selectedCell.col,
          { target: inputElement }
        );
      }
    }
  }
  private refreshTable() {
    this.table = this.sudokuService.table;
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { Difficulty } from '../../../../core/enums/difficulty.enum';
import { Subscription } from 'rxjs';
import { SudokuService } from '../../services/sudoku.service';
import { UserService } from '../../../users/services/user.service';

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
  private firstChangeMade = false;
  private readonly usersService = inject(UserService);

  ngOnInit() {
    this.tableUpdatedSubscription = this.sudokuService.tableUpdated.subscribe(
      () => {
        this.refreshTable();
      }
    );

    if (this.sudokuService.table && this.sudokuService.table.length > 0) {
      this.refreshTable();
    } else {
      this.sudokuService.generateSudoku(Difficulty.Easy);
      this.sudokuService.tableUpdated.next();
    }
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
    if (this.sudokuService.selectedCell === null) return;
    const inputValue = event.target.value;
    if (inputValue === '') return;
    const parsedValue = parseInt(inputValue, 10);
    if (isNaN(parsedValue)) {
      event.target.value = '';
      return;
    }

    if (!this.firstChangeMade) {
      this.firstChangeMade = true;
      const currentUserId = localStorage.getItem('userId');
      const user = this.usersService.users.find((u) => u.id === currentUserId);
      if (!user) {
        console.error('User not found');
        return;
      }
      user.gamesPlayed += 1;
      this.usersService.updateUser(user).catch((error) => {
        console.error('Failed to update user stats:', error);
      });
    }

    if (!this.sudokuService.canPlaceNumber(row, col, parsedValue)) {
      console.log(this.sudokuService.mistakes$.value);
      return;
    }

    this.table[row][col] = parsedValue;
    const isComplete = this.table.every((row: number[]) =>
      row.every((cell) => cell !== 0)
    );
    if (isComplete) {
      this.sudokuService.completeSudoku(this.sudokuService.difficulty);
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
    }
  }
  @HostListener('document:keydown', ['$event'])
  private handleKeyboardEvent(event: KeyboardEvent) {
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

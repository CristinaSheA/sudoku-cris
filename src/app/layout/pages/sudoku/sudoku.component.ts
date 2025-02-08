import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { TableComponent } from './components/table/table.component';
import { StadisticsComponent } from './components/stadistics/stadistics.component';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import { SudokuService } from './services/sudoku.service';
import { Difficulty } from './components/enums/difficulty.enum';

@Component({
  selector: 'sudoku',
  standalone: true,
  imports: [TableComponent, StadisticsComponent, ControlPanelComponent],
  templateUrl: './sudoku.component.html',
  styleUrl: './sudoku.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SudokuComponent {
  private readonly sudokuService: SudokuService =
    inject(SudokuService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef)
  public generateSudoku(difficulty: string) {
    switch (difficulty) {
      case 'easy':
        this.sudokuService.generateSudoku(Difficulty.Easy)
        break;
      case 'medium':
        this.sudokuService.generateSudoku(Difficulty.Medium)
        break;
      case 'hard':
        this.sudokuService.generateSudoku(Difficulty.Hard)
        break;
      default: 
        this.sudokuService.generateSudoku(Difficulty.Easy)
        break
    }
    this.cdr.detectChanges();
  }


}

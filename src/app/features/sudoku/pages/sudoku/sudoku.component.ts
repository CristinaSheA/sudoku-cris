import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { Difficulty } from '../../../../core/enums/difficulty.enum';
import { ControlPanelComponent } from '../../components/control-panel/control-panel.component';
import { StadisticsComponent } from '../../components/stadistics/stadistics.component';
import { TableComponent } from '../../components/table/table.component';
import { SudokuService } from '../../services/sudoku.service';


@Component({
  selector: 'sudoku',
  standalone: true,
  imports: [TableComponent, StadisticsComponent, ControlPanelComponent],
  templateUrl: './sudoku.component.html',
  styleUrl: './sudoku.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SudokuComponent {
  private readonly sudokuService: SudokuService = inject(SudokuService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  
  public generateSudoku(difficulty: string) {
    switch (difficulty) {
      case 'easy':
        this.sudokuService.generateSudoku(Difficulty.Easy);
        this.sudokuService.tableUpdated.next()
        break;
      case 'medium':
        this.sudokuService.generateSudoku(Difficulty.Medium);
        this.sudokuService.tableUpdated.next()
        break;
      case 'hard':
        this.sudokuService.generateSudoku(Difficulty.Hard);
        this.sudokuService.tableUpdated.next()
        break;
    }
    this.cdr.detectChanges();
  }
}

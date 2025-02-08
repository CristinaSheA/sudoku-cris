import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { SudokuService } from '../../services/sudoku.service';
import { CtrlService } from '../../services/ctrl.service';

@Component({
  selector: 'control-panel',
  standalone: true,
  imports: [],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlPanelComponent {
  private readonly sudokuService: SudokuService = inject(SudokuService);
  private readonly ctrlService: CtrlService = inject(CtrlService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  public mistakes = this.sudokuService.mistakes;

  ngOnInit() {
    this.mistakes = this.sudokuService.mistakes;
  }
  public regenerateSudoku() {
    this.ctrlService.regenerateSudoku();
  }
  public hint() {
    this.ctrlService.hint()
    this.cdr.markForCheck();
  }
  public resolve() {
    this.sudokuService.fillSudoku();
    this.cdr.detectChanges()
    this.cdr.markForCheck()
    // this.regenerateSudoku()
  }
}

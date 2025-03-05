import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { SudokuService } from '../../services/sudoku.service';
import { CtrlService } from '../../services/ctrl.service';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'control-panel',
  standalone: true,
  imports: [FormsModule, SettingsComponent],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlPanelComponent {
  private readonly sudokuService: SudokuService = inject(SudokuService);
  private readonly ctrlService: CtrlService = inject(CtrlService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  public mistakes = this.sudokuService.mistakes;
  public isLightMode: boolean = true;
  public showSettings: boolean = false;

  public setShowSettings(value: boolean) {
    this.showSettings = value
    console.log(this.showSettings);
  }

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
  }

  // public toggleMode() {
  //   if (this.isLightMode) {
  //     document.body.classList.remove('dark-mode');
  //     document.body.classList.add('light-mode');
  //     console.log(document.body.classList);
  //   } else {
  //     document.body.classList.remove('light-mode');
  //     document.body.classList.add('dark-mode');
  //   }
  // }
}

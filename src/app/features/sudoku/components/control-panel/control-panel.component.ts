import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompetePopupComponent } from '../../../../features/competitions/components/compete-popup/compete-popup.component';
import { SettingsComponent } from '../../../../shared/components/settings/settings.component';
import { SudokuService } from '../../services/sudoku.service';

@Component({
  selector: 'control-panel',
  standalone: true,
  imports: [FormsModule, SettingsComponent, CompetePopupComponent],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlPanelComponent {
  private readonly sudokuService: SudokuService = inject(SudokuService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  public mistakes = this.sudokuService.mistakes;
  public isLightMode: boolean = true;
  public showSettings: boolean = false;
  public showCompetitionPopup: boolean = false;


  public setShowSettings(value: boolean) {
    this.showSettings = value;
    this.showCompetitionPopup = false;
  }
  public setShowCompetition(value: boolean) {
    this.showCompetitionPopup = value;
    this.showSettings = false;
  }
  ngOnInit() {
    this.mistakes = this.sudokuService.mistakes;
  }
  public regenerateSudoku() {
    this.sudokuService.regenerateSudoku();
  }
  public hint() {
    this.sudokuService.hint();
    this.cdr.markForCheck();
  }
  public resolve() {
    this.sudokuService.fillSudoku();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
}

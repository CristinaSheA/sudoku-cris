import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Competition } from '../../interfaces/competition.interface';
import { CompetitionsService } from '../../services/competitions.service';
import { SudokuComponent } from '../sudoku/sudoku.component';
import { TableComponent } from '../sudoku/components/table/table.component';
import { SudokuService } from '../../services/sudoku.service';
import { SettingsComponent } from '../sudoku/components/control-panel/components/settings/settings.component';

@Component({
  selector: 'app-competition',
  imports: [TableComponent, SettingsComponent],
  templateUrl: './competition.component.html',
  styleUrl: './competition.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompetitionComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly competitionsService = inject(CompetitionsService);
  private readonly sudokuService = inject(SudokuService);
  private readonly router = inject(Router);
  public currentCompetition!: Competition;
  public mistakes = this.sudokuService.mistakes;
  public showSettings: boolean = false;


  ngOnInit() {
    console.log('ss');
    this.route.params.subscribe((params) => {
      const competitionId = params['id'];
      this.competitionsService.getCompetitionById(competitionId).subscribe({
        next: (comp) => {
          this.currentCompetition = comp;
          console.log('Competition loaded:', comp);
          console.log('Competition sudoku:', comp.sudoku);
          console.log('sudoku:', this.sudokuService.table);
          this.sudokuService.table = comp.sudoku;
          console.log('sudoku:', this.sudokuService.table);
          console.log('Competition sudoku:', comp.sudoku);
          this.sudokuService.tableUpdated.next()
        },
        error: () => this.router.navigate(['/sudoku']),
      });
    });
  }
  public setShowSettings(value: boolean) {
    this.showSettings = value;
  }
}

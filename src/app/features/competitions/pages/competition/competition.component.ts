import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Competition } from '../../../../core/interfaces/competition.interface';
import { CompetitionsService } from '../../services/competitions.service';
import { SettingsComponent } from '../../../../shared/components/settings/settings.component';
import { TableComponent } from '../../../sudoku/components/table/table.component';
import { SudokuService } from '../../../sudoku/services/sudoku.service';
import { UserService } from '../../../users/services/user.service';
import { User } from '../../../../core/interfaces/user.interface';

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
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  public currentCompetition!: Competition;
  public mistakes = this.sudokuService.mistakes;
  public showSettings: boolean = false;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const competitionId = params['id'];
      this.loadCompetition(competitionId);
      this.competitionsService.getCompetitionById(competitionId).subscribe({
        next: (comp) => {
          this.currentCompetition = comp;
          this.sudokuService.table = comp.sudoku;
          this.sudokuService.tableUpdated.next();
          this.competitionsService.setTable(this.currentCompetition)
          this.loadParticipants
        },
        error: () => this.router.navigate(['/sudoku']),
      });
    });
  }
  public setShowSettings(value: boolean) {
    this.showSettings = value;
  }
  public leaveCompetition() {
    this.competitionsService.leaveCompetition(this.currentCompetition);
    this.competitionsService.getCompetitions();
    const competition = this.competitionsService.competitions.find(
      (comp) => comp.id === this.currentCompetition.id
    );
    console.log(competition);
  }
  private loadCompetition(id: string) {
    this.competitionsService.getCompetitionById(id).subscribe({
      next: (comp) => {
        this.currentCompetition = comp;
        this.sudokuService.table = comp.sudoku;
        this.sudokuService.tableUpdated.next();
      },
      error: () => this.router.navigate(['/sudoku']),
    });
  }
  public get loadParticipants() {
    let participants = []
    for (const participantId of this.currentCompetition.participants) {
      const participant = this.userService.users.find(
        (part) => part.id === participantId
      );
      participants.push(participant)
    }
    return participants
  }
  public isCurrentUser(player: User | undefined): boolean {
    const currentUserId = localStorage.getItem('userId');
    if (typeof player === 'object') {
      return player.id === currentUserId;
    }
    return player === currentUserId;
  }
}

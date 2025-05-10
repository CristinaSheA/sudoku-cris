import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
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
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly competitionsService = inject(CompetitionsService);
  private readonly sudokuService = inject(SudokuService);
  private readonly userService = inject(UserService);
  public currentCompetition!: Competition;
  public showSettings: boolean = false;
  public mistakesCount: number = 0;

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
          this.loadPlayers
        },
        error: () => this.router.navigate(['/sudoku']),
      });
    });
    this.sudokuService.mistakes$.subscribe(count => {
      this.mistakesCount = count;
      this.cdr.markForCheck();
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
  public get loadPlayers() {
    let players = []
    for (const participantId of this.currentCompetition.players) {
      const participant = this.userService.users.find(
        (part) => part.id === participantId
      );
      players.push(participant)
    }
    return players
  }
  public isCurrentUser(player: User | undefined): boolean {
    const currentUserId = localStorage.getItem('userId');
    if (typeof player === 'object') {
      return player.id === currentUserId;
    }
    return player === currentUserId;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  if (!target.closest('settings') && !target.closest('.settings.button')) {
    this.showSettings = false;
    this.cdr.markForCheck();
  }
  }
}

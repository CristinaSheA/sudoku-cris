import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { PlayerStatsService } from '../../services/player-stats.service';

@Component({
  selector: 'stadistics',
  standalone: true,
  imports: [],
  templateUrl: './stadistics.component.html',
  styleUrl: './stadistics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StadisticsComponent {
  public playerStatsService: PlayerStatsService = inject(PlayerStatsService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  public successRatePercentage(a: number) {
    switch (a) {
      case 1:
        return this.playerStatsService.gamesPlayed;
      case 2:
        return this.playerStatsService.gamesWon;
      case 3:
        return this.playerStatsService.successRatePercentage;
      case 4:
        return this.playerStatsService.easyGamesWon;
      case 5:
        return this.playerStatsService.mediumGamesWon;
      case 6:
        return this.playerStatsService.hardGamesWon;
    }
    this.cdr.detectChanges()
    this.cdr.markForCheck()
    return
  }
}

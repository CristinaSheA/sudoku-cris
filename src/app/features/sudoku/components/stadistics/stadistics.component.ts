import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { UserService } from '../../../../features/users/services/user.service';

@Component({
  selector: 'stadistics',
  standalone: true,
  imports: [],
  templateUrl: './stadistics.component.html',
  styleUrl: './stadistics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StadisticsComponent {
  private readonly userService: UserService = inject(UserService);

  public getUserStat(
    statType:
      | 'gamesPlayed'
      | 'totalGamesWon'
      | 'easyWins'
      | 'mediumWins'
      | 'hardWins'
  ): number {
    const currentUserId = localStorage.getItem('userId');
    const user = this.userService.users.find(
      (user) => user.id === currentUserId
    );
    const statMap = {
      gamesPlayed: user!.gamesPlayed || 0,
      totalGamesWon:
        (user!.gamesWon.easy || 0) +
        (user!.gamesWon.medium || 0) +
        (user!.gamesWon.hard || 0),
      easyWins: user!.gamesWon.easy || 0,
      mediumWins: user!.gamesWon.medium || 0,
      hardWins: user!.gamesWon.hard || 0,
    };
    return statMap[statType];
  }
  public getDifficultyPercentage(
    type:
      | 'gamesPlayed'
      | 'totalGamesWon'
      | 'easyWins'
      | 'mediumWins'
      | 'hardWins'
  ): number {
    const value = Number(this.getUserStat(type));
    const total = Number(this.getUserStat('gamesPlayed'));

    if (total === 0) return 0;
    return (value / total) * 100;
  }
  public getSuccessRate(): number {
    const gamesPlayed = this.getUserStat('gamesPlayed') || 0;
    const easyWins = this.getUserStat('easyWins') || 0;
    const mediumWins = this.getUserStat('mediumWins') || 0;
    const hardWins = this.getUserStat('hardWins') || 0;

    const totalGamesWon = easyWins + mediumWins + hardWins;

    if (gamesPlayed === 0) return 0;

    const successRate = (totalGamesWon / gamesPlayed) * 100;
    return parseFloat(successRate.toFixed(2));
  }
}

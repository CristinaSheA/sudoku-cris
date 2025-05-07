import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  public getUserStat(statType: 'gamesPlayed' | 'gamesWon' | 'easyWins' | 'mediumWins' | 'hardWins'): number | undefined {
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) return undefined;
    
    const user = this.userService.users.find(user => user.id === currentUserId);
    if (!user) return undefined;
    
    const statMap = {
      gamesPlayed: user.gamesPlayed,
      gamesWon: user.gamesWon,
      easyWins: user.easyGamesWon,
      mediumWins: user.mediumGamesWon,
      hardWins: user.hardGamesWon
    };
    
    this.cdr.markForCheck();
    return statMap[statType];
  }

  public getDifficultyPercentage(type: 'gamesPlayed' | 'gamesWon' | 'easyWins' | 'mediumWins' | 'hardWins'): number {
    const value = Number(this.getUserStat(type));
    const total = Number(this.getUserStat('gamesPlayed'));

    if (total === 0) return 0;
    return (value / total) * 100;
  }
  getSuccessRate(): number {
    const gamesPlayed = this.getUserStat('gamesPlayed') || 0;
    const gamesWon = this.getUserStat('gamesWon') || 0;
    
    if (gamesPlayed === 0) return 0; 
    
    const successRate = (gamesWon / gamesPlayed) * 100;
    return parseFloat(successRate.toFixed(2));
  }
}

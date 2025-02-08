import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerStatsService {
  public gamesPlayed: number = 0
  public gamesWon: number = 0
  public successRate: number = 0
  public easyGamesWon: number = 0
  public mediumGamesWon: number = 0
  public hardGamesWon: number = 0

  public get successRatePercentage(): number {
  if (this.gamesPlayed === 0) {
    return 0;
  }
  return (this.gamesWon / this.gamesPlayed) * 100; 
}
}

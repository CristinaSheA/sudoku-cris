import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { UserService } from '../../../../services/user.service';

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
  public successRatePercentage(a: number) {
    const user = this.userService.getCurrentUser();
    switch (a) {
      case 1:
        return user.gamesPlayed;
      case 2:
        return user.gamesWon;
      case 3:
        return user.successRate;
      case 4:
        return user.easyGamesWon;
      case 5:
        return user.mediumGamesWon;
      case 6:
        return user.hardGamesWon;
    }
    this.cdr.detectChanges();
    this.cdr.markForCheck();
    return;
  }
}

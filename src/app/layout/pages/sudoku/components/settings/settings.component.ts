import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'settings',
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly userService: UserService = inject(UserService);
  public logOut() {
    this.userService.logOut();
  }
  public delete() {
    this.userService.deleteAccount();
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { CtrlService } from '../../services/ctrl.service';

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

  isDarkTheme!: boolean;
  constructor(private ctrlService: CtrlService) {}
  ngOnInit() {
    this.isDarkTheme = this.ctrlService.isDarkTheme();
  }
  changeTheme(event: Event) {
    const theme = (event.target as HTMLSelectElement).value;
    this.ctrlService.setTheme(theme);
    this.isDarkTheme = theme === 'dark';
  }
}

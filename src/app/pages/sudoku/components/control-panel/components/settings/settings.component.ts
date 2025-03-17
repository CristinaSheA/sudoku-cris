import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserService } from '../../../../../../services/user.service';
import { SettingsService } from '../../../../../../services/settings.service';

@Component({
  selector: 'settings',
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly userService: UserService = inject(UserService);
  private readonly settingsService: SettingsService = inject(SettingsService);

  public logOut() {
    this.userService.logOut();
  }
  public delete() {
    this.userService.deleteAccount();
  }

  isDarkTheme!: boolean;
  constructor() {}
  ngOnInit() {
    this.isDarkTheme = this.settingsService.isDarkTheme();
  }
  changeTheme(event: Event) {
    const theme = (event.target as HTMLSelectElement).value;
    this.settingsService.setTheme(theme);
    this.isDarkTheme = theme === 'dark';
  }
}

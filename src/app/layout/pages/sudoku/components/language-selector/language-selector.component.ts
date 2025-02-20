import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'language-selector',
  imports: [],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectorComponent { }

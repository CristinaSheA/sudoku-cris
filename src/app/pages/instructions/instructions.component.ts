import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructionsComponent { }

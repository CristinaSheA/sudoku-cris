import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CompetitionSection } from '../../../../../../enums/competition-section.enum';
import { CompetitionsService } from '../../../../../../services/competitions.service';


@Component({
  selector: 'compete-popup',
  imports: [],
  templateUrl: './compete-popup.component.html',
  styleUrl: './compete-popup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompetePopupComponent {
  private readonly competitionsService: CompetitionsService = inject(CompetitionsService);
  public competitionSection: CompetitionSection = CompetitionSection.Join;
  public competitionConfig = {
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    privacity: 'public' as 'public' | 'private',
    maxPlayers: 4
  };

  ngOnInit() {
    this.competitionsService.getCompetitions();
  }
  
  public get competitions() {
    return this.competitionsService.competitions;
  }
  public createCompetition() {
    const config = this.competitionConfig;
    this.competitionsService.createCompetition(
      config.difficulty,
      config.privacity,
      config.maxPlayers
    );
  }
  public changeConfig(event: Event, field: string) {
    const value = (event.target as HTMLSelectElement).value;
    switch (field) {
      case 'difficulty':
        this.competitionConfig.difficulty = value as 'easy' | 'medium' | 'hard';
        break;
      case 'privacity':
        this.competitionConfig.privacity = value as 'public' | 'private';
        break;
      case 'maxPlayers':
        this.competitionConfig.maxPlayers = Number(value);
        break;
    }
  }
  public changeSection(section: string) {
    switch (section) {
      case 'join':
        this.competitionSection = CompetitionSection.Join;
        break;
      case 'create':
        this.competitionSection = CompetitionSection.Create;
        break;
    }
  }
}

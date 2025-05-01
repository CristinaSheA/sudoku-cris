import { Routes } from '@angular/router';

import { AuthComponent } from './features/users/pages/auth/auth.component';
import { AuthGuard } from './core/guards/auth.guard';
import { CompetitionComponent } from './features/competitions/pages/competition/competition.component';
import { AboutUsComponent } from './features/info-pages/about-us/about-us.component';
import { InstructionsComponent } from './features/info-pages/instructions/instructions.component';
import { SudokuComponent } from './features/sudoku/pages/sudoku/sudoku.component';

export const routes: Routes = [
  {
    path: 'sudoku',
    component: SudokuComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'instructions',
    component: InstructionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'competition/:id',
    component: CompetitionComponent,
  },
  { path: '', redirectTo: 'sudoku', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: 'sudoku',
  },
];
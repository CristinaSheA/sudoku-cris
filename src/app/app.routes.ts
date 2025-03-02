import { Routes } from '@angular/router';
import { AboutUsComponent } from './layout/pages/about-us/about-us.component';
import { InstructionsComponent } from './layout/pages/instructions/instructions.component';
import { SudokuComponent } from './layout/pages/sudoku/sudoku.component';
import { AuthComponent } from './layout/pages/auth/auth.component';

export const routes: Routes = [
  {
    path: 'sudoku',
    component: SudokuComponent,
  },
  {
    path: 'instructions',
    component: InstructionsComponent,
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
  },
  {
    path: 'auth',
    component: AuthComponent,
  },

  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: 'auth',
  },
];

import { Routes } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { InstructionsComponent } from './pages/instructions/instructions.component';
import { SudokuComponent } from './pages/sudoku/sudoku.component';
import { AuthComponent } from './pages/auth/auth.component';
import { AuthGuard } from './guards/auth.guard';

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
  { path: '', redirectTo: 'sudoku', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: 'sudoku',
  },
];
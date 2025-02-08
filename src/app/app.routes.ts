import { Routes } from '@angular/router';
import { AboutUsComponent } from './layout/pages/about-us/about-us.component';
import { InstructionsComponent } from './layout/pages/instructions/instructions.component';
import { SudokuComponent } from './layout/pages/sudoku/sudoku.component';

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
  
  { path: '', redirectTo: '/sudoku/easy', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: 'sudoku',
  },
];

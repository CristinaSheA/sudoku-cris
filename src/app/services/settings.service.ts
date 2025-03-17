import { inject, Injectable } from '@angular/core';
import { SudokuService } from './sudoku.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public readonly sudokuService: SudokuService = inject(SudokuService);
  private readonly THEME_KEY = 'theme';
  private readonly DARK_THEME = 'dark';
  private readonly LIGHT_THEME = 'light';

  constructor() {
    const savedTheme = localStorage.getItem(this.THEME_KEY) || this.LIGHT_THEME;
    this.setTheme(savedTheme);
  }
  
  public setTheme(theme: string) {
    document.body.classList.remove(this.DARK_THEME, this.LIGHT_THEME);
    document.body.classList.add(theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }
  public isDarkTheme(): boolean {
    return localStorage.getItem(this.THEME_KEY) === this.DARK_THEME;
  }
  private toggleTheme() {
    const currentTheme = localStorage.getItem(this.THEME_KEY) || this.LIGHT_THEME;
    const newTheme = currentTheme === this.LIGHT_THEME ? this.DARK_THEME : this.LIGHT_THEME;
    this.setTheme(newTheme);
  }
}

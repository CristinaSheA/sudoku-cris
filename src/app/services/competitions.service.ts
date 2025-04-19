import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Competition } from '../interfaces/competition.interface';
import { UserService } from './user.service';
import { SudokuService } from './sudoku.service';
import { Difficulty } from '../enums/difficulty.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompetitionsService {
  private apiUrl = 'http://localhost:3000';
  private readonly http = inject(HttpClient);
  private readonly userService = inject(UserService);
  private readonly sudokuService = inject(SudokuService);
  public competitions: Competition[] = [];

  public getCompetitions() {
    return this.http.get<any[]>(`${this.apiUrl}/competitions`).subscribe({
      next: (response) => {
        this.competitions = response;
      },
      error: (error) => {
        console.error('Error al recibir las competiciones', error);
      },
    });
  }
  public getCompetitionById(id: string): Observable<Competition> {
    return this.http.get<Competition>(`${this.apiUrl}/competitions/${id}`);
  }
  public get publicCompetitions() {
    return this.competitions.filter((comp) => comp.privacity === 'public');
  }
  public async createCompetition(
    difficulty: string,
    privacity: string,
    maxPlayers: number | null
  ) {
    const creator = await this.userService.getCurrentUser();
    const creatorId = creator.id;
    let sudoku;
    switch (difficulty) {
      case 'easy':
        sudoku = this.sudokuService.generateSudoku(Difficulty.Easy);
        break;
      case 'medium':
        sudoku = this.sudokuService.generateSudoku(Difficulty.Medium);
        break;
      case 'hard':
        sudoku = this.sudokuService.generateSudoku(Difficulty.Hard);
        break;
    }

    return this.http
      .post(`${this.apiUrl}/competitions`, {
        difficulty,
        privacity,
        maxPlayers,
        creatorId,
        sudoku
      })
      .subscribe({
        next: (response) => {
          console.log('Competition created:', response);
          this.getCompetitions();
        },
        error: (error) => {
          console.error('Error creating competition:', error);
        },
      });
  }
  public setTable(competition: Competition) {
    this.sudokuService.table = competition.sudoku
  }
}

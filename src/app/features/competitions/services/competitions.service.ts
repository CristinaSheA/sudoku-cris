import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Competition } from '../../../core/interfaces/competition.interface';
import { Difficulty } from '../../../core/enums/difficulty.enum';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { SudokuService } from '../../sudoku/services/sudoku.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CompetitionsService {
  private apiUrl = 'http://localhost:3000/competitions';
  private readonly http = inject(HttpClient);
  private readonly sudokuService = inject(SudokuService);
  public competitions: Competition[] = [];
  private readonly router = inject(Router);
  
  public getCompetitions() {
    return this.http.get<any[]>(`${this.apiUrl}`).subscribe({
      next: (response) => {
        this.competitions = response;
      },
      error: (error) => {
        console.error('Error al recibir las competiciones', error);
      },
    });
  }
  public getCompetitionById(id: string): Observable<Competition> {
    return this.http.get<Competition>(`${this.apiUrl}/${id}`);
  }
  public async createCompetition(
    difficulty: string,
    privacity: string,
    maxPlayers: number | null
  ) {
    const creatorId = localStorage.getItem('userId');
    if (!creatorId) return;
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
      .post(`${this.apiUrl}`, {
        difficulty,
        privacity,
        maxPlayers,
        creatorId,
        sudoku,
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
  public async updateCompetition(competition: Competition) {
    return this.http
      .patch(`${this.apiUrl}/${competition.id}`, {
        competition,
      })
      .subscribe({
        next: (response) => {
          console.log('Competition updated:', response);
          this.getCompetitions();
          console.log(this.competitions);
        },
        error: (error) => {
          console.error('Error updating competition:', error);
        },
      });
  }
  public get publicCompetitions() {
    return this.competitions.filter((comp) => comp.privacity === 'public');
  }
  public leaveCompetition(competition: Competition) {
    const creatorId = localStorage.getItem('userId');
    competition.players.filter((userId) => userId !== creatorId);
    this.updateCompetition(competition)
    return this.router.navigate([`/sudoku`]);
  }
  public setTable(competition: Competition) {
    this.sudokuService.table = competition.sudoku;
  }
  public joinCompetition(competitionId: string): Observable<any> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return throwError(() => new Error('User ID not found'));
    }

    return this.http
      .patch(`${this.apiUrl}/${competitionId}/join`, { userId })
      .pipe(
        tap(() => {
          console.log(this.competitions);
          this.getCompetitions();
          console.log(this.competitions);
        }),
        catchError((error) => {
          console.error('Error joining competition:', error);
          return throwError(() => error);
        })
      );
  }
}

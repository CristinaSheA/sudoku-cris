import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Competition } from '../interfaces/competition';

@Injectable({
  providedIn: 'root',
})
export class CompetitionsService {
  private apiUrl = 'http://localhost:3000';
  private http = inject(HttpClient);
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
  public get publicCompetitions() {
    return this.competitions.filter(comp => comp.privacity === 'public');
  }
  public createCompetition(difficulty: string, privacity: string,maxPlayers: number | null) {
    const joinCode = this.generateJoinCode();
    return this.http
      .post(`${this.apiUrl}/competitions`, {
        difficulty,
        privacity,
        maxPlayers,
        joinCode,
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
  private generateJoinCode() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }
}

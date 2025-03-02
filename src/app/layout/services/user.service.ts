import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { log } from 'console';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly router = inject(Router);
  public apiUrl = 'http://localhost:3000/users';
  
  public createAccount(form: FormGroup): void {
    const username = form.get('username')!.value;
    const email = form.get('email')!.value;
    const password = form.get('password')!.value;

    if (form.invalid) {
      console.error('Formulario inválido');
      return;
    }

    this.createQuery(username, email, password).subscribe({
      next: (response) => {
        console.log('Usuario creado exitosamente', response);
      },
      error: (error) => {
        console.error('Error al crear el usuario', error);
        return
      }
    });
    this.router!.navigateByUrl('forum/home');
  }

  private createQuery(
    username: string,
    email: string,
    password: string,
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}`, {
      username,
      email,
      password,
    });
  }
}

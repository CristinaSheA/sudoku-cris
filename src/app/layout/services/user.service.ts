import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly router = inject(Router);
  public apiUrl = 'http://localhost:3000/users';
  private isAuthenticated = false;

  constructor() {
    // Recupera el estado de autenticación desde localStorage
    this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  }
  public isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
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
    this.isAuthenticated = true;
  }
  public loginAccount(form: FormGroup): void {
    const email = form.get('email')!.value;
    const password = form.get('password')!.value;

    if (form.invalid) {
      console.error('Formulario inválido');
      return;
    }

    this.loginQuery(email, password).subscribe({
      next: (response) => {
        console.log('Sesión iniciada exitosamente', response);
      },
      error: (error) => {
        console.error('Error al iniciar sesión', error);
        return
      }
    });
    this.router.navigate(['/sudoku']);
    this.isAuthenticated = true;
    localStorage.setItem('isAuthenticated', 'true');
  }
  public logout(): void {
    const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });
  swalWithBootstrapButtons.fire({
    title: "Are you sure you want to log out?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      swalWithBootstrapButtons.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
        title: "Cancelled",
        text: "Your imaginary file is safe :)",
        icon: "error"
      });
    }
  });
    this.router.navigate(['/auth']);
    this.isAuthenticated = false;
    localStorage.setItem('isAuthenticated', 'false');
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
  private loginQuery(
    email: string,
    password: string,
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      email,
      password,
    });
  }
}

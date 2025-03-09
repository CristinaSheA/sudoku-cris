import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private readonly router = inject(Router);
  public apiUrl = 'http://localhost:3000/users';
  private isAuthenticated = false;

  constructor() {
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
        return;
      },
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
  
        // Guarda el userId y actualiza el estado de autenticación
        localStorage.setItem('userId', response.id);
        localStorage.setItem('isAuthenticated', 'true');
        this.isAuthenticated = true;
  
        // Navega a la página de sudoku
        this.router.navigate(['/sudoku']);
      },
      error: (error) => {
        console.error('Error al iniciar sesión', error);
        Swal.fire('Error', 'Invalid email or password', 'error'); // Muestra un mensaje de error
      },
    });
  }
  public getCurrentUser(): any {
    const userId = localStorage.getItem('userId');
    return this.http.get(`${this.apiUrl}/${userId}`).subscribe({
      next: (response) => {
        return response;
      },
      error: (error) => {
        console.error('Error al crear el usuario', error);
        return;
      },
    });
  }
  public logOut(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: true,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure you want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Log out',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('userId');
          localStorage.removeItem('isAuthenticated');
          this.isAuthenticated = false;
          this.router.navigate(['/auth']);
        }
      });
  }
  public deleteAccount() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: true,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure you want to delete your account?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete account',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        confirmButtonColor: '#ea5f5f',
        cancelButtonColor: '#4A90E2',
      })
      .then((result) => {
        if (result.isConfirmed) {
          const userId = localStorage.getItem('userId');
          if (!userId || userId === 'undefined') {
            Swal.fire('Error', 'User ID not found', 'error');
            return;
          }

          this.deleteQuery(userId).subscribe({
            next: () => {
              localStorage.removeItem('userId');
              localStorage.removeItem('isAuthenticated');
              this.isAuthenticated = false;
              this.router.navigate(['/auth']);
              Swal.fire(
                'Deleted!',
                'Your account has been deleted.',
                'success'
              );
            },
            error: (error) => {
              Swal.fire('Error', 'Failed to delete account', 'error');
              console.error('Delete error:', error);
            },
          });
        }
      });
  }

  private deleteQuery(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  private createQuery(
    username: string,
    email: string,
    password: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}`, {
      username,
      email,
      password,
    });
  }
  private loginQuery(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      email,
      password,
    });
  }
}

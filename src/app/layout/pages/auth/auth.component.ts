import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UserService);

  public authMode = 'log-in';

  public form: FormGroup = this.fb!.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: [
      '',
      [Validators.required, Validators.minLength(1), Validators.email],
    ],
    password: ['', [Validators.required, Validators.minLength(1)]],
  });
  public changeAuthMode(mode: number) {
    switch (mode) {
      case 1:
        this.authMode = 'log-in'
        break;
      case 2:
        this.authMode = 'sign-up'
        break;
      default:
        break;
    }
  } 
  public createUser() { 
    this.usersService!.createAccount(this.form)
  }
}

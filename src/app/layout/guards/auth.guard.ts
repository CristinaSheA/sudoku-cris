// import type { CanActivateFn } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
  
//   return true;
// };

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.userService.isLoggedIn()) {
      return true; // Permite el acceso a la ruta
    } else {
      // Redirige al usuario a la página de autenticación
      this.router.navigate(['/auth']);
      return false; // Bloquea el acceso a la ruta
    }
  }
}
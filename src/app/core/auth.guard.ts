import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';
import {map, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

      return this.authService.user$.pipe(
        take(1),
        map(user => !!user && user.role === 'user'),
        tap(loggedIn => {
          if (!loggedIn) {
            console.log('acces denied');
            this.router.navigate(['/login/user-login']);
          }
        })
      );

  }
}

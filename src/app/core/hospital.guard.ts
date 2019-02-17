import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';
import {map, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HospitalGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.hospital$.pipe(
      take(1),
      map(hospital => !!(hospital && hospital.role === 'hospital')),
      tap(loggedIn => {
        if (!loggedIn) {
          console.log('acces denied');

          // TODO redirect to 404 or similar
          this.router.navigate(['/login/centru']);
        }
      })
    );
  }
}

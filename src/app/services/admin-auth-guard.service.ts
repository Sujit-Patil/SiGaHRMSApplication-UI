import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService {
  role: any;
  constructor(private authService: AuthService) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree> {
    
    if ((!!localStorage.getItem('jwt') && 'Admin' === this.authService.decodeObjectFromBase64(localStorage.getItem('jwt'))['role'])) {
      return true;
    } else {
      this.authService.logout();
      return false;
    }
  }
}

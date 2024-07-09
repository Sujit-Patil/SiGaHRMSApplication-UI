import { Injectable } from '@angular/core';
import { ApiService } from '../api/api-service.service';
import { Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  role: any;
  constructor(
    private Apiservice: ApiService,
    private router: Router,
    private alertService: AlertService
  ) {}

  login(email: string, password: string) {
    this.Apiservice.login(email, password).subscribe((data) => {
      const { IsSuccess, Result, Message } = data;
      console.log(data);
      if (IsSuccess) {
        localStorage.setItem('jwt', Result);
        this.role = jwtDecode(Result)['role'];
        console.log(this.role);

        if (this.role == 'Super Admin') {
          this.router.navigate(['admin/dashboard']);
        } else if (this.role == 'User') {
          this.router.navigate(['guest/dashboard']);
        } else {
          this.logout();
        }
      } else {
        this.alertService.Invalid('Oops...', Message + ' !', 'error').then(() => this.logout());
      }
    });
  }

  decodeObjectFromBase64(token: string): any {
    return jwtDecode(token);
  }

  logout() {
    localStorage.clear();
    this.alertService
      .Toast()
      .fire({ icon: 'success', title: 'Signed in successfully' })
      .then((data) => {
        if (data.dismiss) {
          this.router.navigate(['/login']);
        }
      });
  }
}

import { Injectable } from '@angular/core';
import { ApiService } from './api-service.service';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';
import {jwtDecode} from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  role:any
  constructor(
    private Apiservice: ApiService,
    private router: Router,
    private alertService: AlertService
  ) {}

  login(email: string, password: string) {
    this.Apiservice.login(email, password).subscribe((data) => {
      
      console.log(data.result);
      
      console.log(data.isSuccess);
      
      
      if (data.isSuccess && data.result!=='Token Is not Genarated') {
        localStorage.setItem('jwt', data.result);
        this.role=jwtDecode(data.result)['role']
        if (this.role === 'Admin') {
          this.router.navigate(['admin/dashboard']);
        } else if (this.role === 'User') {
          this.router.navigate(['guest/dashboard']);
        } else {
          this.logout();
        }
      } else {
        this.alertService.Invalid('Oops...', 'Something went wrong!', 'error').then(() => this.logout());
      }
    });
  }

  

  decodeObjectFromBase64(token: string): any {
      return jwtDecode(token);
  }

  logout() {
    console.log("Logout called authservice");
    
    localStorage.clear();
    this.alertService.ToastAlert('Sign out successfully').then((data) => {
      if (data.dismiss) {
        this.router.navigate(['/login']);
    
        console.log("Logout called alertservice");      
      }
    });
  }
}

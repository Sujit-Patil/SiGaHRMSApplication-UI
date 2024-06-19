import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api-service.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  constructor(
    private Auth: AuthService,
    private ApiService: ApiService,
    private CommonService: CommonService,
    private router: Router,
    private AlertService: AlertService
  ) {}

  User: any = {
    Email: '',
    Password: ''
  };

  async login() {
    await this.Auth.login(this.User.Email, this.User.Password);
  }
}

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Employee, NotificationDto, Api, Leave } from 'src/app/Dto/DataTypes';
import { ApiService } from 'src/app/services/api-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  employee: Employee;
  Role: any;
  email: any;
  notification: NotificationDto[] = [];
  time: string;
  NotifictionBar = true;
  constructor(
    private AuthService: AuthService,
    private ApiService: ApiService,
    private router: Router,
    private datePipe: DatePipe,
    private CommonService: CommonService
  ) {}
  ngOnInit() {
    this.decodeJwt();
  }
  decodeJwt() {
    this.Role=this.AuthService.decodeObjectFromBase64(localStorage.getItem('jwt'))['role']
    
   

    this.email = this.AuthService.decodeObjectFromBase64(localStorage.getItem('jwt'))['email'];
   
  }
  
  profile = [
    {
      icon: 'ti ti-user',
      title: 'View Profile'
    },
    {
      icon: 'ti ti-edit-circle',
      title: 'Edit Profile'
    },

    {
      icon: 'ti ti-power',
      title: 'Logout'
    }
  ];

  setting = [
    {
      icon: 'ti ti-help',
      title: 'Support'
    },
    {
      icon: 'ti ti-user',
      title: 'Account Settings'
    },
    {
      icon: 'ti ti-lock',
      title: 'Privacy Center'
    },
    {
      icon: 'ti ti-messages',
      title: 'Feedback'
    },
    {
      icon: 'ti ti-list',
      title: 'Contect Us'
    }
  ];

  LogOut() {
    this.AuthService.logout();
  }
}

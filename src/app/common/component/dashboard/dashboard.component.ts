import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../../component/module/shared.module';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from '../../service/authitication/auth.service';
import { Attendance, Employee } from '../../datatypes/DataTypes';
import { UserRole } from '../../enum/enum';
import { AdminChartComponent } from '../admin-chart/admin-chart.component';
import { UserChartComponent } from '../user-chart/user-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, SharedModule, AdminChartComponent, UserChartComponent]
})
export default class DashboardComponent {
  employee: Employee;
  attendanceList: Attendance[];
  attendanceButton: any;
  currentUser: any;
  userRole = UserRole;

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private authService: AuthService
  ) {}

  ngOnInit(){
    this.currentUser = this.authService.decodeObjectFromBase64(localStorage.getItem('jwt'));
  }
  transaction = [
    {
      background: 'text-success bg-light-success',
      icon: 'ti ti-gift',
      title: 'Order #002434',
      time: 'Today, 2:00 AM',
      amount: '+ $1,430',
      percentage: '78%'
    },
    {
      background: 'text-primary bg-light-primary',
      icon: 'ti ti-message-circle',
      title: 'Order #984947',
      time: '5 August, 1:45 PM',
      amount: '- $302',
      percentage: '8%'
    },
    {
      background: 'text-danger bg-light-danger',
      icon: 'ti ti-settings',
      title: 'Order #988784',
      time: '7 hours ago',
      amount: '- $682',
      percentage: '16%'
    },
    {
      background: 'text-dark bg-light-secondary',
      icon: 'bi bi-cake',
      title: 'Order #002434',
      time: 'Today, 2:00 AM',
      amount: '+ $1,430',
      percentage: '78%'
    },
    {
      background: 'text-info bg-light-info',
      icon: 'ti ti-confetti',
      title: 'Order #984947',
      time: '5 August, 1:45 PM',
      amount: '- $302',
      percentage: '8%'
    },
    {
      background: 'text-warning bg-light-warning',
      icon: 'ti ti-bell-ringing',
      title: 'Order #988784',
      time: '7 hours ago',
      amount: '- $682',
      percentage: '16%'
    }
  ];
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { LeaveBalance } from 'src/app/common/datatypes/DataTypes';
import { Api, LeaveBalanceStatus, UserRole } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import LeavebalanceFormComponent from './leavebalance-form/leavebalance-form.component';
import { AuthService } from 'src/app/common/service/authitication/auth.service';

@Component({
  selector: 'app-leavebalances',
  standalone: true,
  templateUrl: './leavebalances.component.html',
  styleUrls: ['./leavebalances.component.scss'],
  imports: [CommonModule, SharedModule, LeavebalanceFormComponent]
})
export default class LeavebalancesComponent {
  active: any;
  activeSection = 'list';
  leavebalances: LeaveBalance[] = [];
  leaveBalanceStatus=LeaveBalanceStatus;
  leaveBalanceId:number;
  currentUser: any;
  userRole = UserRole;
  constructor(private apiService: ApiService,private authService:AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.decodeObjectFromBase64(localStorage.getItem('jwt'))
    this.getLeaveBalance();
  }

  handleNotification(activeSection: string) {
    this.getLeaveBalance();
    this.activeSection = activeSection;
  }

  getLeaveBalance() {
    this.apiService.getAll(Api.LeaveBalance).subscribe((data) => {
      this.leavebalances = data;
    });
  }
}

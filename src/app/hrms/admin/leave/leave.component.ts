import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { AlertService } from 'src/app/common/service/alert/alert.service';
import { LeaveRequest, RequestDto, leaveTypeOptions } from 'src/app/common/datatypes/DataTypes';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from 'src/app/common/service/authitication/auth.service';
import { Api } from 'src/app/common/enum/enum';
import LeavebalancesComponent from '../leavebalances/leavebalances.component';

@Component({
  selector: 'app-leave',
  standalone: true,
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss'],
  imports: [CommonModule, SharedModule, LeavebalancesComponent]
})
export default class LeaveComponent {
  active: any;
  from: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  to: any = this.datePipe.transform(new Date(new Date().getFullYear(), 12, 31), 'yyyy-MM-dd');
  leaveTypeOptions = leaveTypeOptions;
  leaveRequest = new LeaveRequest();
  leaveRequests: LeaveRequest[];
  email: string;
  activeSection: string = 'leave';

  constructor(
    private alertService: AlertService,
    private apiService: ApiService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {
    this.GetLeaveByDate();
  }

  GetLeaveByDate() {
    this.apiService.getByDate(Api.LeaveRequest, new RequestDto(null, this.from, this.to)).subscribe((data) => {
      this.leaveRequests = data;
    });
  }

  async newLeaveRequest() {
    this.leaveRequest.EmployeeId = Number(this.authService.decodeObjectFromBase64(localStorage.getItem('jwt'))['employeeId']);
    if ((await this.alertService.leaveRequestAlert(this.leaveRequest)).isConfirmed) {
      this.apiService.post(Api.LeaveRequest, this.leaveRequest).subscribe((data) => {
        this.alertService
          .Toast()
          .fire({ icon: 'success', title: 'Leave Request Added Successfully' })
          .then((data) => (data.dismiss ? this.GetLeaveByDate() : ''));
      });
    }
  }

  async updateLeaveRequest(id: number) {
    this.leaveRequest = this.leaveRequests.find((x) => x.LeaveRequestId === id);
    if ((await this.alertService.leaveRequestAlert(this.leaveRequest)).isConfirmed) {
      this.apiService.update(Api.LeaveRequest, this.leaveRequest).subscribe((data) => {
        this.alertService
          .Toast()
          .fire({ icon: 'success', title: 'Leave Request Updated Successfully' })
          .then((data) => (data.dismiss ? this.GetLeaveByDate() : ''));
      });
    }
  }

  async deleteLeaveRequest(id: number) {
    this.apiService.get(Api.LeaveRequest, id).subscribe((deleteLeaveRequest) => {
      if (deleteLeaveRequest.LeaveRequestStatus === 'Open') {
        deleteLeaveRequest.IsDeleted = true;
        this.apiService.update(Api.LeaveRequest, deleteLeaveRequest).subscribe((data) => {
          this.alertService
            .Toast()
            .fire({ icon: 'success', title: 'Leave Request Deleted Successfully' })
            .then((data) => (data.dismiss ? this.GetLeaveByDate() : ''));
        });
      }
    });
  }

  async showReason(Reason) {
    await this.alertService.Show(Reason);
  }
}

import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { leaveTypeOptions, LeaveRequest, RequestDto } from 'src/app/common/datatypes/DataTypes';
import { LeaveRequestStatus, UserRole, Api } from 'src/app/common/enum/enum';
import { AlertService } from 'src/app/common/service/alert/alert.service';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from 'src/app/common/service/authitication/auth.service';

@Component({
  selector: 'app-user-leave',
  standalone: true,
  templateUrl: './user-leave.component.html',
  styleUrls: ['./user-leave.component.scss'],
  imports: [CommonModule, SharedModule]
})
export default class UserLeaveComponent {
  active: any;
  from: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  to: any = this.datePipe.transform(new Date(new Date().getFullYear(), 12, 31), 'yyyy-MM-dd');
  today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  leaveTypeOptions = leaveTypeOptions;
  leaveRequest = new LeaveRequest();
  leaveRequests: LeaveRequest[];
  activeSection: string = 'leave';
  currentUserId: any;
  leaveRequestStatus = LeaveRequestStatus;
  userRole = UserRole;

  constructor(
    private alertService: AlertService,
    private apiService: ApiService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {}

  GetLeaveByDate() {
    this.apiService.getByDate(Api.LeaveRequest, new RequestDto(this.currentUserId, this.from, this.to)).subscribe((data) => {
      this.leaveRequests = data;
      console.log(this.leaveRequests);
    });
  }

  ngOnInit() {
    this.currentUserId = Number(this.authService.decodeObjectFromBase64(localStorage.getItem('jwt')).employeeId);
    this.GetLeaveByDate();
  }

  async newLeaveRequest() {
    this.apiService.get(Api.LeaveRequest,this.currentUserId).subscribe(async (data)=>{
      this.leaveRequest.EmployeeId = this.currentUserId;
      if ((await this.alertService.leaveRequestAlert(this.leaveRequest,data,this.leaveRequests)).isConfirmed) {
        this.apiService.post(Api.LeaveRequest, this.leaveRequest).subscribe((data) => {
          if (data.IsValid) {
            this.alertService
              .Toast()
              .fire({ icon: 'success', title: 'Leave Request Added Successfully' })
              .then((data) => (data.dismiss ? this.GetLeaveByDate() : ''));
          }
        });
      }
    })
    
  }

  async updateLeaveRequest(request) {
    this.apiService.get(Api.LeaveRequest,this.currentUserId).subscribe(async (data)=>{
    if ((await this.alertService.leaveRequestAlert(request,data,this.leaveRequests)).isConfirmed) {
      this.apiService.update(Api.LeaveRequest, request).subscribe((data) => {
        if (data.IsValid) {
          this.alertService
            .Toast()
            .fire({ icon: 'success', title: 'Leave Request Updated Successfully' })
            .then((data) => (data.dismiss ? this.GetLeaveByDate() : ''));
        }
      });
    }
  })
  }

  async deleteLeaveRequest(request) {
    this.apiService.update(Api.LeaveRequest, request).subscribe((data) => {
      if (data.IsValid) {
        this.alertService
          .Toast()
          .fire({ icon: 'error', title: 'Leave Request Deleted Successfully' })
          .then((data) => (data.dismiss ? this.GetLeaveByDate() : ''));
      }
    });
  }

  async showReason(Reason) {
    await this.alertService.Show(Reason);
  }
}

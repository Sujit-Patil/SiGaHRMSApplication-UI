import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { AlertService } from 'src/app/common/service/alert/alert.service';
import { LeaveRequest, RequestDto, leaveTypeOptions } from 'src/app/common/datatypes/DataTypes';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from 'src/app/common/service/authitication/auth.service';
import { Api, LeaveRequestStatus, UserRole } from 'src/app/common/enum/enum';
import LeavebalancesComponent from '../leavebalances/leavebalances.component';

@Component({
  selector: 'app-leave',
  standalone: true,
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss'],
  imports: [CommonModule, SharedModule, LeavebalancesComponent]
})
export default class LeaveComponent implements OnInit {
  active: any;
  from: string;
  to: string;
  today: string;
  leaveTypeOptions = leaveTypeOptions;
  leaveRequest = new LeaveRequest();
  leaveRequests: LeaveRequest[] = [];
  activeSection: string = 'leave';
  currentUser: any;
  leaveRequestStatus = LeaveRequestStatus;
  userRole = UserRole;

  constructor(
    private alertService: AlertService,
    private apiService: ApiService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {
    const today = new Date();
    this.from = this.datePipe.transform(today, 'yyyy-MM-dd')!;
    this.to = this.datePipe.transform(new Date(today.getFullYear(), 11, 31), 'yyyy-MM-dd')!;
    this.today = this.datePipe.transform(today, 'yyyy-MM-dd')!;
  }

  ngOnInit() {
    this.currentUser = this.authService.decodeObjectFromBase64(localStorage.getItem('jwt'));
    this.loadLeaveRequests();
  }

  loadLeaveRequests() {
    const requestDto = new RequestDto(null, this.from, this.to);
    this.apiService.getByDate(Api.LeaveRequest, requestDto).subscribe((data) => {
      this.leaveRequests = data;
    });
  }

  private getEmployeeId() {
    return Number(this.authService.decodeObjectFromBase64(localStorage.getItem('jwt'))['employeeId']);
  }

  private handleApiResponse(message: string, callback: () => void) {
    this.alertService
      .Toast()
      .fire({ icon: 'success', title: message })
      .then((data) => {
        if (data.dismiss) {
          callback();
        }
      });
  }

  approve(request: LeaveRequest) {
    this.updateLeaveRequestStatus(request, 'Leave Approved');
  }

  reject(request: LeaveRequest) {
    this.updateLeaveRequestStatus(request, 'Leave Rejected');
  }

  private updateLeaveRequestStatus(request: LeaveRequest, message: string) {
    this.apiService.updateLeaveRequestStatus(Api.LeaveRequest, request).subscribe((data) => {
      if (data.IsValid) {
        this.handleApiResponse(message, () => this.loadLeaveRequests());
      }
    });
  }

  async processLeaveRequest(action: 'new' | 'update', id?: number) {
    const employeeId = this.getEmployeeId();
    const leaveBalance = await this.apiService.get(Api.LeaveBalance, employeeId).toPromise();
    if (action === 'update') {
      this.leaveRequest = this.leaveRequests.find((x) => x.LeaveRequestId === id)!;
    }
    const isConfirmed = (
      await this.alertService.leaveRequestAlert(
        this.leaveRequest,
        leaveBalance,
        this.leaveRequests.filter((data) => data.EmployeeId === employeeId)
      )
    ).isConfirmed;
    if (isConfirmed) {
      this.apiService[action === 'new' ? 'post' : 'update'](Api.LeaveRequest, this.leaveRequest).subscribe(() => {
        this.handleApiResponse(action === 'new' ? 'Leave Request Added Successfully' : 'Leave Request Updated Successfully', () =>
          this.loadLeaveRequests()
        );
      });
    }
  }

  newLeaveRequest() {
    this.processLeaveRequest('new');
  }

  updateLeaveRequest(id: number) {
    this.processLeaveRequest('update', id);
  }

  deleteLeaveRequest(id: number) {
    this.apiService.get(Api.LeaveRequest, id).subscribe((request) => {
      if (request.LeaveRequestStatus === 'Open') {
        request.IsDeleted = true;
        this.apiService.update(Api.LeaveRequest, request).subscribe(() => {
          this.handleApiResponse('Leave Request Deleted Successfully', () => this.loadLeaveRequests());
        });
      }
    });
  }

  async showReason(reason: string) {
    await this.alertService.Show(reason);
  }
}

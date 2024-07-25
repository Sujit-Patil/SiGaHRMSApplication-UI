import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Employee, LeaveBalance, LeaveBalanceStatusOptions } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { AlertService } from 'src/app/common/service/alert/alert.service';
import { ApiService } from 'src/app/common/service/api/api-service.service';

@Component({
  selector: 'app-leavebalance-form',
  standalone: true,
  templateUrl: './leavebalance-form.component.html',
  styleUrls: ['./leavebalance-form.component.scss'],
  imports: [CommonModule, SharedModule]
})
export default class LeavebalanceFormComponent {
  @Input() leaveBalancesList: LeaveBalance[];
  @Input() updateleaveBalanceId: number;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  leaveBalance: LeaveBalance;
  leaveBalanceStatuses = LeaveBalanceStatusOptions;
  employees: Employee[];

  constructor(
    private apiService: ApiService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.updateleaveBalanceId !== undefined
      ? (this.leaveBalance = this.leaveBalancesList.find((data) => data.LeaveBalanceId == this.updateleaveBalanceId))
      : (this.leaveBalance = new LeaveBalance()),
      (this.leaveBalance.Year = new Date().getFullYear());
    this.prepareOptions();
  }

  prepareOptions() {
    this.apiService.getAll(Api.Employee).subscribe((data: Employee[]) => {
      this.updateleaveBalanceId == undefined
        ? (this.employees = data.filter((employee) => !this.leaveBalancesList.find((x) => x.EmployeeId == employee.EmployeeId)))
        : (this.employees = data);
    });
  }

  notifyParent(title) {
    this.alertService
      .Toast()
      .fire({ icon: 'success', title: title })
      .then((data) => (data.dismiss ? this.notify.emit('list') : ''));
  }

  addLeaveBalance() {
    this.apiService
      .post(Api.LeaveBalance, this.leaveBalance)
      .subscribe((data) => (data.IsValid ? this.notifyParent('Leave Balance Added Successfully') : ''));
  }

  updateLeaveBalance() {
    this.apiService
      .update(Api.LeaveBalance, this.leaveBalance)
      .subscribe((data) => (data.IsValid ? this.notifyParent('Leave Balance Updated Successfully') : ''));
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Employee, LeaveBalance, LeaveBalanceStatusOptions } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
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
  leaveBalance = new LeaveBalance();
  leaveBalanceStatuses = LeaveBalanceStatusOptions;
  employees: Employee[];

  constructor(private apiService: ApiService) {
    this.apiService.getAll(Api.Employee).subscribe((data: Employee[]) => {
      this.employees = data.filter((employee) => {
        return !this.leaveBalancesList.find((x) => x.EmployeeId == employee.EmployeeId);
      });
    });
  }

  ngOnInit() {
    console.log(this.leaveBalancesList);
  }

  addLeaveBalance() {}

  updateLeaveBalance() {}
}

import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Employee, LeaveBalance } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';

import { SalaryComponent } from './salary/salary.component';
import { LeavesComponent } from './leaves/leaves.component';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, SharedModule, SalaryComponent, LeavesComponent],
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export default class EmployeeProfileComponent {
  activeSection: any = 'Profile';
  employeeId: number;
  employee: Employee;
  leaveBalance: LeaveBalance;
  totalAssignLeaves: number = 0;
  totalAvailedLeaves: number = 0;
  totalAvailableLeaves: number = 0;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.employeeId = Number(params.get('id'));
    });
    this.getEmployee();
  }
  getEmployee() {
    this.apiService.get(Api.Employee, this.employeeId).subscribe((data) => {
      this.employee = data;
    });
  }
}

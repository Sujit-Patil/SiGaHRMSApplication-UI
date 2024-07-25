import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { EmployeeSalary, RequestDto } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from 'src/app/common/service/authitication/auth.service';
import { CommonService } from 'src/app/common/service/common/common.service';

@Component({
  selector: 'app-user-salary',
  standalone: true,
  templateUrl: './user-salary.component.html',
  styleUrls: ['./user-salary.component.scss'],
  imports: [CommonModule, SharedModule]
})
export default class UserSalaryComponent implements OnInit {
  actionLink = 'list';
  employeeSalary: EmployeeSalary[] = [];
  employeeId: number;
  from: string;
  to: string;

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {
    const dates = this.initializeDateRange();
    this.from = dates.from;
    this.to = dates.to;
  }

  ngOnInit() {
    this.employeeId = this.getEmployeeId();
    this.getEmployeesSalaryStructures();
  }

  initializeDateRange() {
    const currentYear = new Date().getFullYear();
    return {
      from: this.datePipe.transform(new Date(currentYear, 0, 1), 'yyyy-MM-dd'),
      to: this.datePipe.transform(new Date(currentYear, 11, 31), 'yyyy-MM-dd')
    };
  }

  getEmployeeId(): number {
    const jwt = localStorage.getItem('jwt');
    const decoded = this.authService.decodeObjectFromBase64(jwt);
    return Number(decoded.employeeId);
  }

  exportToCsv() {
    this.commonService.exportToCsv(this.employeeSalary, 'SigaEmployeesList.csv');
  }

  getEmployeesSalaryStructures() {
    const requestDto = new RequestDto(this.employeeId, this.from, this.to);
    this.apiService.getByDate(Api.EmployeeSalaryStructure, requestDto).subscribe((data: EmployeeSalary[]) => {
      this.employeeSalary = data;
      console.log(this.employeeSalary);
    });
  }

  deleteEmployee(empSalaryStructure: EmployeeSalary) {
    empSalaryStructure.IsDeleted = true;
  }

  viewEmployeeDetails(Id: number) {
    this.employeeId = Id;
    this.actionLink = 'profile';
  }
}

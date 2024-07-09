import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Employee, EmployeeSalary } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { AlertService } from 'src/app/common/service/alert/alert.service';
import { ApiService } from 'src/app/common/service/api/api-service.service';

@Component({
  selector: 'app-employee-salary-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './employee-salary-form.component.html',
  styleUrls: ['./employee-salary-form.component.scss']
})
export class EmployeeSalaryFormComponent {
  @Input() template: string;
  @Input() employeeSalary: EmployeeSalary[];
  @Input() updateId: any;
  employeeSalaryDto: EmployeeSalary;
  employees: any[] = [];

  constructor(
    private apiService: ApiService,
    private alertService: AlertService
  ) {
    this.getEmployees();
  }

  ngOnInit() {
    this.updateId !== undefined
      ? (this.employeeSalaryDto = this.employeeSalary.find((data) => data.EmployeeId == this.updateId))
      : (this.employeeSalaryDto = new EmployeeSalary());
  }
  async getEmployees() {
    await this.apiService.getAll(Api.Employee).subscribe((data: Employee[]) => {
      this.employees = data.map((employee) => {
        return this.employeeSalary.map((x) => {
          return x.EmployeeId != employee.EmployeeId;
        });
      });
    });
  }
  addEmployeeSalaryStructure() {
    this.employeeSalaryDto.EmployeeId = Number(this.employeeSalaryDto.EmployeeId);
    this.employeeSalaryDto.CreatedDateTime = new Date().toISOString();
    this.apiService.post(Api.EmployeeSalaryStructure, this.employeeSalaryDto).subscribe((data) => {
      this.alertService
        .Toast()
        .fire({ icon: 'success', title: 'New Employee Salary Structure Added Successfully' })
        .then((data) => (data.dismiss ? '' : ''));
    });
  }

  addEmployeeSalary() {
    this.employeeSalaryDto.EmployeeId = Number(this.employeeSalaryDto.EmployeeId);
    this.employeeSalaryDto.CreatedDateTime = new Date().toISOString();
    this.apiService.post(Api.EmployeeSalary, this.employeeSalaryDto).subscribe((data) => {
      this.alertService
        .Toast()
        .fire({ icon: 'success', title: 'New Employee Salary Added Successfully' })
        .then((data) => (data.dismiss ? '' : ''));
    });
  }

  updateEmployeeSalary() {
    this.apiService.update(Api.EmployeeSalary, this.employeeSalaryDto).subscribe((data) => {
      this.alertService
        .Toast()
        .fire({ icon: 'success', title: 'Employee Salary Updated Successfully' })
        .then((data) => (data.dismiss ? '' : ''));
    });
  }

  updateEmployeeSalaryStructure() {
    this.apiService.update(Api.EmployeeSalaryStructure, this.employeeSalaryDto).subscribe((data) => {
      this.alertService
        .Toast()
        .fire({ icon: 'success', title: 'Employee Salary Structure Updated Successfully' })
        .then((data) => (data.dismiss ? '' : ''));
    });
  }
}

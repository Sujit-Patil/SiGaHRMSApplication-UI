import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { EmployeeSalary, RequestDto } from 'src/app/common/datatypes/DataTypes';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { CommonService } from 'src/app/common/service/common/common.service';
import { EmployeeSalaryFormComponent } from './employee-salary-form/employee-salary-form.component';
import { Api } from 'src/app/common/enum/enum';
import { EmployeeSalaryProfileComponent } from './employee-salary-profile/employee-salary-profile.component';
import { AuthService } from 'src/app/common/service/authitication/auth.service';

@Component({
  selector: 'app-employee-salary',
  standalone: true,
  templateUrl: './employee-salary.component.html',
  styleUrls: ['./employee-salary.component.scss'],
  imports: [CommonModule, SharedModule, EmployeeSalaryFormComponent, EmployeeSalaryProfileComponent]
})
export default class EmployeeSalaryComponent {
  getSalary() {
    throw new Error('Method not implemented.');
  }
  actionLink: string = 'list';
  active: any;
  employeeSalary: EmployeeSalary[] = [];
  status: boolean;
  updateId: any;
  from: any = null;
  to: any = null;

  constructor(
    private apiService: ApiService,
    private CommonService: CommonService,
    private authService: AuthService
  ) {
    this.getEmployeesSalaryStructures();
  }

  JsonToCsv() {
    this.CommonService.exportToCsv(this.employeeSalary, 'SigaEmployeesList.csv');
  }

  getEmployeesSalaryStructures() {
    this.apiService.getByDate(Api.EmployeeSalaryStructure, new RequestDto(this.updateId, this.from, this.to)).subscribe((data) => {
      this.employeeSalary = data;
    });
  }

  deleteEmployee(empSalaryStructure: EmployeeSalary) {
    empSalaryStructure.IsDeleted = true;
  }

  DetailsEmployee(Id: number) {
    this.updateId = Id;
    this.actionLink = 'profile';
  }
}

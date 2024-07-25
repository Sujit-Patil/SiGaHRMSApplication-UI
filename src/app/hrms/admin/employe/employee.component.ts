import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/common/service/alert/alert.service';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { Employee } from 'src/app/common/datatypes/DataTypes';
import { CommonService } from 'src/app/common/service/common/common.service';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Api } from 'src/app/common/enum/enum';
import { AuthService } from 'src/app/common/service/authitication/auth.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  imports: [CommonModule, SharedModule, EmployeeFormComponent]
})
export default class EmployeeComponent {
  activeSection: string = 'list';
  active: any;
  employees: Employee[];
  status: boolean;
  updateId: any;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private ApiService: ApiService,
    private CommonService: CommonService,
    private authService: AuthService
  ) {
    this.getEmployees();
  }

  JsonToCsv() {
    this.CommonService.exportToCsv(this.employees, 'SigaEmployeesList.csv');
  }

  getEmployees() {
    this.ApiService.getAll(Api.Employee).subscribe((data) => {
      this.employees = data;
      console.log('employess', this.employees);
    });
  }

  deleteEmployee(employee: Employee) {
    employee.IsDeleted = true;
    this.alertService.DeleteAlert().then((result) => {
      if (result.isConfirmed) {
        this.ApiService.update(Api.Employee, employee).subscribe((data) => {
          this.alertService
            .Toast()
            .fire({ icon: 'success', title: 'Employee Deleted Successfully' })
            .then((data) => (data.dismiss ? this.getEmployees() : ''));
        });
      }
    });
  }

  DetailsEmployee(Id: number) {
    this.router.navigate(['admin/profile', Id]);
  }
}

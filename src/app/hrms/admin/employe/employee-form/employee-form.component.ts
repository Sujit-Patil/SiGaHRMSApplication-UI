import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Employee } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { AlertService } from 'src/app/common/service/alert/alert.service';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from 'src/app/common/service/authitication/auth.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent {
  @Input() employees: Employee[];
  @Input() updateId: any;
  active: any;
  employee: any;
  employeeDto: Employee;
  today: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  selectedFile: File | undefined;
  constructor(
    private ApiService: ApiService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private alertService:AlertService
  ) {}

  ngOnInit() {
    this.updateId !== undefined
      ? (this.employeeDto = this.employees.find((data) => data.EmployeeId == this.updateId))
      : (this.employeeDto = new Employee());
  }
  onFileSelected(event: any) {
    this.employeeDto.ProfileImg = event.target.files[0] as File;
  }

  addEmployee() {
    this.ApiService.post(Api.Employee, this.employeeDto).subscribe((data) => {
      this.alertService
      .Toast()
      .fire({ icon: 'success', title: 'New Employee Added Successfully' })
      .then((data) => (data.dismiss ? window.location.reload() : ''));
    });
  }

  updateEmployee() {
    this.ApiService.update(Api.Employee, this.employeeDto).subscribe((data) => {
      this.alertService
      .Toast()
      .fire({ icon: 'success', title: 'Employee Updated Successfully' })
      .then((data) => (data.dismiss ? window.location.reload() : ''));
    });
  }
}

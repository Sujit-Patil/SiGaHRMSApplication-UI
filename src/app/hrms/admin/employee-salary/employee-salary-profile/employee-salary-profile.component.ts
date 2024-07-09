import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { EmployeeSalary, RequestDto } from 'src/app/common/datatypes/DataTypes';
import { EmployeeSalaryFormComponent } from '../employee-salary-form/employee-salary-form.component';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { Api } from 'src/app/common/enum/enum';

@Component({
  selector: 'app-employee-salary-profile',
  standalone: true,
  templateUrl: './employee-salary-profile.component.html',
  styleUrls: ['./employee-salary-profile.component.scss'],
  imports: [CommonModule, SharedModule, EmployeeSalaryFormComponent]
})
export class EmployeeSalaryProfileComponent {
  @Input() updateId: any;
  @Input() employeeSalary: EmployeeSalary[];
  actionLink: any='list';
  date: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  employeeSalaries: EmployeeSalary[] = [];
  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getEmployeeSalaries();
  }

  getEmployeeSalaries() {
    var fromDate = this.employeeSalary.find((x) => x.EmployeeId == this.updateId).FromDate;
    this.apiService.getByDate(Api.EmployeeSalary, new RequestDto(this.updateId, fromDate, this.date)).subscribe((data) => {
      this.employeeSalaries = data;
    });
  }
}

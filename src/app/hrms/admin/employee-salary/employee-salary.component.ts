import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { EmployeeSalary, Incentive, RequestDto } from 'src/app/common/datatypes/DataTypes';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { CommonService } from 'src/app/common/service/common/common.service';
import { EmployeeSalaryFormComponent } from './employee-salary-form/employee-salary-form.component';
import { Api } from 'src/app/common/enum/enum';
import { AlertService } from 'src/app/common/service/alert/alert.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-employee-salary',
  standalone: true,
  templateUrl: './employee-salary.component.html',
  styleUrls: ['./employee-salary.component.scss'],
  imports: [CommonModule, SharedModule, EmployeeSalaryFormComponent]
})
export default class EmployeeSalaryComponent implements OnInit {
  template: string = 'EmployeeSalary';
  actionLink: string = 'month';
  employeeSalary: EmployeeSalary[] = [];
  employeeSalaryStructures: EmployeeSalary[] = [];
  incentives: Incentive[] = [];
  employess: any[] = [];
  from: string = this.datePipe.transform(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd');
  to: string = this.actionLink === 'month' ? this.datePipe.transform(new Date(new Date().getFullYear(), 11, 31), 'yyyy-MM-dd') : null;
  updateId: any;

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadSalaries();
  }

  async newIncentive(id: number = null) {
    const incentivePurposes = await this.loadIncentivePurposes();
    const incentive = new Incentive();
    incentive.EmployeeId = id;
    const alertResult = await this.alertService.incentiveRequestAlert(incentive, incentivePurposes, this.employess);

    if (alertResult.isConfirmed) {
      const data = await this.apiService.post(Api.Incentive, incentive).toPromise();
      if (data.IsValid) {
        await this.alertService
          .Toast()
          .fire({ icon: 'success', title: 'Incentive Added Successfully' })
          .then(async (data) => {
            if (data.dismiss) {
              await this.getIncentive();
            }
          });
      }
    }
  }

  async updateIncentive(incentive: Incentive) {
    const incentivePurposes = await this.loadIncentivePurposes();
    const alertResult = await this.alertService.incentiveRequestAlert(incentive, incentivePurposes, this.employess);

    if (alertResult.isConfirmed) {
      const data = await this.apiService.update(Api.Incentive, incentive).toPromise();
      if (data.IsValid) {
        await this.alertService
          .Toast()
          .fire({ icon: 'success', title: 'Incentive Updated Successfully' })
          .then(async (data) => {
            if (data.dismiss) {
              await this.getIncentive();
            }
          });
      }
    }
  }

  private loadIncentivePurposes() {
    return this.apiService.getAll(Api.IncentivePurpose).toPromise();
  }

  async getIncentive() {
    const data = await this.apiService.getByDate(Api.Incentive, new RequestDto(null, this.from, this.to)).toPromise();
    this.incentives = data;
  }

  loadSalaries() {
    forkJoin({
      employeeSalaries: this.apiService.getByDate(Api.EmployeeSalary, new RequestDto(this.updateId, this.from, this.to)),
      salaryStructures: this.apiService.getByDate(Api.EmployeeSalaryStructure, new RequestDto(null, null, null)),
      incentives: this.apiService.getByDate(Api.Incentive, new RequestDto(null, this.from, this.to))
    }).subscribe({
      next: ({ employeeSalaries, salaryStructures, incentives }) => {
        this.employeeSalary = employeeSalaries.sort(
          (a, b) => new Date(b.SalaryForAMonth).getTime() - new Date(a.SalaryForAMonth).getTime()
        );
        this.employeeSalaryStructures = salaryStructures;
        this.incentives = incentives;
        this.employess = this.employeeSalaryStructures.map((data) => data.Employee);
      }
    });
  }

  JsonToCsv() {
    this.commonService.exportToCsv(this.employeeSalary, 'SigaEmployeesList.csv');
  }

  deleteEmployee(empSalaryStructure: EmployeeSalary) {
    empSalaryStructure.IsDeleted = true;
  }

  DetailsEmployee(id: number) {
    this.updateId = id;
    this.actionLink = 'profile';
  }
}

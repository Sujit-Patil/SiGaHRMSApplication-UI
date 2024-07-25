import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Employee, EmployeeSalary, EmployeeSalaryStructure, LeaveRequest, RequestDto } from 'src/app/common/datatypes/DataTypes';
import { Api, LeaveRequestStatus } from 'src/app/common/enum/enum';
import { AlertService } from 'src/app/common/service/alert/alert.service';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-salary-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './employee-salary-form.component.html',
  styleUrls: ['./employee-salary-form.component.scss']
})
export class EmployeeSalaryFormComponent implements OnInit {
  @Input() template: string;
  @Input() employeeSalary: EmployeeSalary[] = [];
  @Input() updateId: any;
  @Input() newEntryId: any;
  employeeSalaryDto: EmployeeSalary;
  employees: Employee[] = [];

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.initEmployeeSalaryDto();
    this.fetchInitialData();
  }

  @HostListener('input', ['$event.target'])
  onInput(target: HTMLInputElement) {
    this.calculateSalaries();
  }
  fetchInitialData() {
    this.getEmployees();

    if (this.newEntryId !== undefined) {
      if (this.template === 'EmployeeSalaryStructure') {
        this.resetEmployeeSalaryDto();
      } else {
        this.getEmployeeSalaryStructure(this.newEntryId);
      }
    }
  }

  getData(id) {
    this.getEmployeeSalaryStructure(id);
  }
  initEmployeeSalaryDto() {
    if (this.updateId !== undefined) {
      this.employeeSalaryDto = this.employeeSalary.find((data) => data.EmployeeId === this.updateId) || new EmployeeSalary();
    } else {
      this.employeeSalaryDto = new EmployeeSalary();
    }
  }

  resetEmployeeSalaryDto() {
    this.employeeSalaryDto = new EmployeeSalary();
  }

  getEmployees() {
    this.apiService.getAll(Api.Employee).subscribe(
      (data: Employee[]) => {
        this.employees = data;
      },
      (error) => {
        console.error('Error fetching employees', error);
      }
    );
  }

  getEmployeeSalaryStructure(id: any) {
    this.apiService.getByDate(Api.EmployeeSalaryStructure, new RequestDto(id, null, null)).subscribe(
      (data: EmployeeSalaryStructure[]) => {
        if (data?.length > 0) {
          this.mapSalaryStructureToDto(data[0]);
          this.calculateSalaries();
          this.calculateLeaves(data[0].EmployeeId);
        } else {
          this.template != 'EmployeeSalaryStructure'
            ? Swal.fire('Salary Structure?', 'Salary Structrure is not Define', 'question').then((data) =>
                data.isConfirmed ? window.location.reload() : window.location.reload()
              )
            : '';
        }
      },
      (error) => {
        console.error('Error fetching employee salary structure', error);
      }
    );
  }

  mapSalaryStructureToDto(salaryStructure: EmployeeSalaryStructure) {
    const { Basic, Conveyance, DA, HRA, TDS, MedicalAllowance, SpecialAllowance, EmployeeId } = salaryStructure;
    Object.assign(this.employeeSalaryDto, {
      Basic: this.calculateMonthlyValue(Basic),
      Conveyance: this.calculateMonthlyValue(Conveyance),
      DA: this.calculateMonthlyValue(DA),
      HRA: this.calculateMonthlyValue(HRA),
      TDS: this.calculateMonthlyValue(TDS),
      PT: 200,
      MedicalAllowance: this.calculateMonthlyValue(MedicalAllowance),
      SpecialAllowance: this.calculateMonthlyValue(SpecialAllowance),
      GrossSalary: 0,
      SalaryForAMonth: this.getDate(),
      Leaves: 0,
      LeaveDeduction: 0,
      PresentDays: 0,
      DaysInAMonth: this.getTotalDaysInCurrentMonth(),
      NetSalary: 0,
      OtherDeduction: 0,
      EmployeeId
    });
  }

  getDate() {
    var date = this.employeeSalary.sort((a, b) => new Date(b.SalaryForAMonth).getTime() - new Date(a.SalaryForAMonth).getTime())[0]
      .SalaryForAMonth;
    return this.datePipe.transform(new Date(new Date().getFullYear(), new Date(date).getMonth() + 1, 7), 'yyyy-MM-dd');
  }
  calculateMonthlyValue(annualValue: number): number {
    return parseFloat((annualValue / 12).toFixed(2));
  }

  lastDateOfMonth(date: Date): Date {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const firstDayOfNextMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1);

    return lastDayOfMonth;
  }
  calculateLeaves(empId: any) {
    const startOfYear = this.formatDate(new Date(new Date().getFullYear(), 0, 1));
    const endOfYear = this.formatDate(new Date(new Date().getFullYear(), 11, 31));

    this.apiService.getByDate(Api.LeaveRequest, new RequestDto(empId, startOfYear, endOfYear)).subscribe((data: LeaveRequest[]) => {
      const leaves = data.filter((leave) => this.isLeaveInCurrentMonth(leave) && leave.LeaveRequestStatus === LeaveRequestStatus.Approved);
      const totalLeaveDays = leaves.reduce((sum, leave) => {
        const endDate =
          new Date(leave.ToDate).getMonth() !== new Date(leave.FromDate).getMonth()
            ? this.lastDateOfMonth(new Date(leave.FromDate))
            : leave.ToDate;
        const leaveDays = this.calculateDaysBetween(leave.FromDate, endDate);
        return sum + (leave.IsHalfDay ? 0.5 : leaveDays);
      }, 0);

      this.updateLeaveDetails(totalLeaveDays);
    });
  }

  formatInputValue(event: any) {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      this.employeeSalaryDto.SpecialAllowance = parseFloat(value.toFixed(2));
    }
  }

  isLeaveInCurrentMonth(leave: LeaveRequest): boolean {
    return new Date(leave.FromDate).getMonth() === new Date(this.employeeSalaryDto.SalaryForAMonth).getMonth() - 1;
  }

  updateLeaveDetails(totalLeaveDays: number) {
    this.employeeSalaryDto.Leaves = totalLeaveDays;
    this.employeeSalaryDto.PresentDays = this.employeeSalaryDto.DaysInAMonth - totalLeaveDays;
    this.employeeSalaryDto.LeaveDeduction = parseFloat(
      ((this.employeeSalaryDto.NetSalary / this.employeeSalaryDto.DaysInAMonth) * totalLeaveDays).toFixed(2)
    );
    this.employeeSalaryDto.NetSalary -= this.employeeSalaryDto.LeaveDeduction;
  }

  calculateDaysBetween(fromDate: string, toDate: string): number {
    const date1 = new Date(fromDate);
    const date2 = new Date(toDate);
    return Math.floor((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24)) + 1;
  }

  calculateSalaries() {
    const { Basic, Conveyance, DA, HRA, MedicalAllowance, SpecialAllowance, TDS, PT, OtherDeduction, LeaveDeduction } =
      this.employeeSalaryDto;
    const grossSalary = Basic + Conveyance + DA + HRA + MedicalAllowance + SpecialAllowance;
    const netSalary = grossSalary - (TDS + PT + OtherDeduction + LeaveDeduction);
    Object.assign(this.employeeSalaryDto, { GrossSalary: parseFloat(grossSalary.toFixed(2)), NetSalary: parseFloat(netSalary.toFixed(2)) });
  }

  getTotalDaysInCurrentMonth(): number {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  saveEmployeeSalary(apiUrl: string, successMessage: string) {
    this.apiService.post(apiUrl, this.employeeSalaryDto).subscribe(
      () =>
        this.alertService
          .Toast()
          .fire({ icon: 'success', title: successMessage })
          .then((data) => (data.dismiss ? window.location.reload() : '')),
      (error) => console.error('Error saving employee salary', error)
    );
  }

  updateEmployeeSalaryData(apiUrl: string, successMessage: string) {
    this.apiService.update(apiUrl, this.employeeSalaryDto).subscribe(
      () =>
        this.alertService
          .Toast()
          .fire({ icon: 'success', title: successMessage })
          .then((data) => (data.dismiss ? window.location.reload() : '')),
      (error) => console.error('Error updating employee salary', error)
    );
  }

  addEmployeeSalaryStructure() {
    this.saveEmployeeSalary(Api.EmployeeSalaryStructure, 'New Employee Salary Structure Added Successfully');
  }

  addEmployeeSalary() {
    this.saveEmployeeSalary(Api.EmployeeSalary, 'New Employee Salary Added Successfully');
  }

  updateEmployeeSalary() {
    this.updateEmployeeSalaryData(Api.EmployeeSalary, 'Employee Salary Updated Successfully');
  }

  updateEmployeeSalaryStructure() {
    this.updateEmployeeSalaryData(Api.EmployeeSalaryStructure, 'Employee Salary Structure Updated Successfully');
  }
}

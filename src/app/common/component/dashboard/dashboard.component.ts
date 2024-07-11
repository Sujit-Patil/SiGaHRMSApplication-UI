import { Component, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../../component/module/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexGrid,
  ApexLegend
} from 'ng-apexcharts';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/common/service/alert/alert.service';
import { AuthService } from '../../service/authitication/auth.service';
import { CommonService } from '../../service/common/common.service';
import { Attendance, Employee, RequestDto } from '../../datatypes/DataTypes';
import { ClockComponent } from '../clock/clock.component';
import { Api } from '../../enum/enum';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  colors: string[];
  stroke: ApexStroke;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  legend: ApexLegend;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, NgApexchartsModule, SharedModule, ClockComponent]
})
export default class DashboardComponent {
  @ViewChild('chart') chart: ChartComponent;
  chartOptions_4: Partial<ChartOptions>;
  chartOptions_5: Partial<ChartOptions>;
  chartOptions_6: Partial<ChartOptions>;
  employee: Employee;
  attendanceList: Attendance[];
  attendanceButton: any;

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private CommonService: CommonService,
    private router: Router,
    private AlertService: AlertService,
    private authService: AuthService
  ) {
    this.decodeJwt();
  }

  checkIn() {
    var attendanceDto = new Attendance();
    attendanceDto.AttendanceDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    attendanceDto.InTime = this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss.SSS'Z'");
    attendanceDto.EmployeeId = this.employee.EmployeeId;
    this.apiService.post(Api.Attendance, attendanceDto).subscribe((data) => {
      this.getAttendanceByDate();
    });
  }

  checkOut(): void {
    const currentAttendance = this.attendanceList.find((x) => x.Employee.CompanyEmail === this.employee.CompanyEmail);
    if (currentAttendance) {
      currentAttendance.OutTime = this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss.SSS'Z'");
      this.apiService.update(Api.Attendance, currentAttendance).subscribe(() => this.getAttendanceByDate());
    }
  }

  getAttendanceByDate(): void {
    const transformedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.apiService.getByDate(Api.Attendance, new RequestDto(null, transformedDate, transformedDate)).subscribe((data) => {
      this.attendanceList = data;
      this.setAttendanceButton();
    });
  }

  private setAttendanceButton(): void {
    const currentAttendance = this.attendanceList.find((x) => x.Employee.CompanyEmail === this.employee.CompanyEmail);

    if (!currentAttendance) {
      this.attendanceButton = 'InTime';
    } else if (!currentAttendance.OutTime) {
      this.attendanceButton = 'OutTime';
    } else {
      this.attendanceButton = 'Completed';
    }
  }
  private async decodeJwt(): Promise<void> {
    const { email: currentUserEmail } = await this.authService.decodeObjectFromBase64(localStorage.getItem('jwt'));

    this.apiService.getUsingEmail(Api.Employee, currentUserEmail).subscribe((data) => {
      this.employee = data;
      this.getAttendanceByDate();
    });
  }
}

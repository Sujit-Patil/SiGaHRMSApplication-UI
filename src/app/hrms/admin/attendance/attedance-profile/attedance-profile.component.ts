import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from 'src/app/common/component/dashboard/dashboard.component';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Attendance, RequestDto } from 'src/app/common/datatypes/DataTypes';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from 'src/app/common/service/authitication/auth.service';
import { CommonService } from 'src/app/common/service/common/common.service';
import { ClockComponent } from '../../../../common/component/clock/clock.component';
import ApexCharts from 'apexcharts';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Api } from 'src/app/common/enum/enum';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-attedance-profile',
  standalone: true,
  templateUrl: './attedance-profile.component.html',
  styleUrls: ['./attedance-profile.component.scss'],
  imports: [CommonModule, SharedModule, NgApexchartsModule, ClockComponent]
})
export class AttedanceProfileComponent {
  @ViewChild('chart') chart: ChartComponent;
  @Input() attendancelist: Attendance[];
  chartOptions: Partial<ChartOptions>;
  date: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  active: any;
  weekChart: ApexCharts;
  monthChart: ApexCharts;
  Completed = false;
  dateArray: number[] = [];
  attendanceButton: string;
  employee: any;
  employeeAtt: Attendance;
  CurrentWorkTime: number;
  WorkTime: number = 0;
  userAuth = false;
  private timerSubscription: Subscription;

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userAuth =
      this.attendancelist[0].EmployeeId === Number(await this.authService.decodeObjectFromBase64(localStorage.getItem('jwt')).employeeId);
    setTimeout(() => this.renderCharts(), 200);
    this.setAttendanceButton();
  }

  async getAttedance() {
    await this.getWeekAttendanceData(this.date);
    await this.getYearAttendanceData();
  }

  async checkIn() {
    var attendanceDto = new Attendance();
    attendanceDto.AttendanceDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    attendanceDto.InTime = this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss.SSS'Z'");
    attendanceDto.EmployeeId = this.employee.EmployeeId;
    attendanceDto.CreatedBy = this.employee.EmployeeId;
    await this.apiService.post(Api.Attendance, attendanceDto).toPromise();
    this.attendanceButton = 'OutTime';
    this.startUpdatingWorkedTime();
    await this.getAttendanceByDate();
    this.calculateWorkTime();
  }

  stopUpdatingWorkedTime(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  async checkOut() {
    this.employeeAtt = this.attendancelist[this.attendancelist.length - 1];
    this.employeeAtt.OutTime = this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss.SSS'Z'");
    await this.apiService.update(Api.Attendance, this.employeeAtt).toPromise();
    this.attendanceButton = 'InTime';
    this.stopUpdatingWorkedTime();
    await this.getAttendanceByDate();
    this.calculateWorkTime();
  }

  async decodeJwt() {
    const { email: currentUserEmail } = await this.authService.decodeObjectFromBase64(localStorage.getItem('jwt'));
    this.employee = await this.apiService.getUsingEmail(Api.Employee, currentUserEmail).toPromise();
  }

  setAttendanceButton() {
    this.employeeAtt = this.attendancelist[0];
    this.getWeekAttendanceData(this.date);
    this.attendanceButton = this.attendancelist.some((x) => x.OutTime === null) ? 'OutTime' : 'InTime';
    this.startUpdatingWorkedTime();
    this.employeeAtt.OutTime = this.attendancelist[this.attendancelist.length - 1].OutTime;
  }

  async getAttendanceByDate() {
    const transformedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.apiService
      .getByDate(Api.Attendance, new RequestDto(this.employeeAtt.EmployeeId, transformedDate, transformedDate))
      .subscribe((data) => (this.attendancelist = data));
    await this.getWeekAttendanceData(transformedDate);
  }

  startUpdatingWorkedTime(): void {
    this.calculateWorkTime();
    if (this.attendanceButton == 'OutTime') {
      this.timerSubscription = interval(1000).subscribe(() => {
        this.employeeAtt.WorkTime = this.commonService.convertSecondsToTime(
          this.WorkTime +
            this.commonService.calculateWorkedTimeinSeconds(
              this.attendancelist[this.attendancelist.length - 1].InTime,
              this.attendancelist[this.attendancelist.length - 1].OutTime
            )
        );
      });
    }
  }

  calculateWorkTime() {
    this.WorkTime = this.attendancelist
      .filter((attendance) => attendance.OutTime != null)
      .map((attendance) => this.commonService.calculateWorkedTimeinSeconds(attendance.InTime, attendance.OutTime))
      .reduce((a, b) => a + b, 0);
    this.employeeAtt.WorkTime = this.commonService.convertSecondsToTime(this.WorkTime);
  }

  async getWeekAttendanceData(date = null) {
    const { startOfWeek, endOfWeek } = this.getWeekRange(new Date(date));
    const data = await this.apiService
      .getByDate(Api.Attendance, new RequestDto(this.employeeAtt.EmployeeId, startOfWeek, endOfWeek))
      .toPromise();
    const array = this.processAttendanceData(data);
    console.log(array);
    this.updateWeekChart(array);
  }

  async getYearAttendanceData(next = false, back = false) {
    let year = new Date(this.date).getFullYear();
    if (next) year += 1;
    if (back) year -= 1;
    const startOfYear = this.datePipe.transform(new Date(year, 0, 1), 'yyyy-MM-dd');
    const endOfYear = this.datePipe.transform(new Date(year, 11, 31), 'yyyy-MM-dd');
    const data = await this.apiService
      .getByDate(Api.Attendance, new RequestDto(this.employeeAtt.EmployeeId, startOfYear, endOfYear))
      .toPromise();
    const array = this.processAttendanceData(data, true);

    console.log(array);

    this.updateMonthChart(array);
  }

  getCalculateWorkedTime(inTime, outTime) {
    return this.commonService.getCalculateWorkedTime(inTime, outTime);
  }
  processAttendanceData(data: Attendance[], isYear: boolean = false): number[] {
    const arrayLength = isYear ? 12 : 7;
    const array = new Array(arrayLength).fill(0);
    data.forEach((attendance: Attendance) => {
      const res = this.commonService.calculateWorkedTime(attendance.InTime, attendance.OutTime);
      const index = isYear ? new Date(attendance.AttendanceDate).getMonth() - 1 : new Date(attendance.AttendanceDate).getDay() - 1;
      array[index] += res;
    });

    for (let index = 0; index < array.length; index++) {
      const totalMinutes = array[index];
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      array[index] = parseFloat(`${hours}.${minutes < 10 ? '0' : ''}${minutes}`);
    }
    return array;
  }

  updateWeekChart(array: number[]) {
    this.weekOptions.series[0].data = array;
    if (this.weekChart) {
      this.weekChart.updateSeries(this.weekOptions.series);
    }
  }

  updateMonthChart(array: number[]) {
    this.monthOptions.series[0].data = array;
    if (this.monthChart) {
      this.monthChart.updateSeries(this.monthOptions.series);
    }
  }
  getWeekRange(date: Date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4);
    return {
      startOfWeek: this.datePipe.transform(startOfWeek, 'yyyy-MM-dd'),
      endOfWeek: this.datePipe.transform(endOfWeek, 'yyyy-MM-dd')
    };
  }

  renderCharts() {
    this.weekChart = new ApexCharts(document.querySelector('#visitor-chart'), this.weekOptions);
    this.weekChart.render();
    if (this.active && this.active.nextId === 2) {
      this.monthChart = new ApexCharts(document.querySelector('#visitor-chart-1'), this.monthOptions);
      this.monthChart.render();
    }
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 1) {
      setTimeout(() => {
        this.weekChart = new ApexCharts(document.querySelector('#visitor-chart'), this.weekOptions);
        this.weekChart.render();
      }, 200);
    }

    if (changeEvent.nextId === 2) {
      this.getYearAttendanceData();
      setTimeout(() => {
        this.monthChart = new ApexCharts(document.querySelector('#visitor-chart-1'), this.monthOptions);
        this.monthChart.render();
      }, 200);
    }
  }

  ngOnDestroy(): void {
    this.stopUpdatingWorkedTime();
  }
  monthOptions = {
    chart: { height: 450, type: 'area', toolbar: { show: false } },
    dataLabels: { enabled: false },
    colors: ['#1890ff', '#13c2c2'],
    series: [{ name: 'Actual Hours', data: [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 53, 41] }],
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] }
  };

  weekOptions = {
    chart: { height: 400, type: 'area', toolbar: { show: true } },
    dataLabels: { enabled: false },
    colors: ['#1890ff', '#13c2c2'],
    series: [{ name: 'Actual Hours', data: [11, 32, 45, 32, 34, 0, 0] }],
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }
  };

  nextMonth() {
    this.getYearAttendanceData(true, false);
    var date = new Date(this.date);
    this.date = this.datePipe.transform(new Date(date.getFullYear() + 1, date.getMonth(), date.getDate()), 'yyyy-MM-dd');
  }

  backMonth() {
    this.getYearAttendanceData(false, true);
    var date = new Date(this.date);
    this.date = this.datePipe.transform(new Date(date.getFullYear() - 1, date.getMonth(), date.getDate()), 'yyyy-MM-dd');
  }
  nextWeek() {
    var date = new Date(this.date);
    date.setDate(date.getDate() + 7);
    this.getWeekAttendanceData(date);
    this.date = this.datePipe.transform(date, 'yyyy-MM-dd');
  }
  backWeek() {
    var date = new Date(this.date);
    date.setDate(date.getDate() - 7);
    this.getWeekAttendanceData(date);
    this.date = this.datePipe.transform(date, 'yyyy-MM-dd');
  }
}

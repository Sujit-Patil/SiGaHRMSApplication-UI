import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Attendance, RequestDto } from 'src/app/common/datatypes/DataTypes';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { CommonService } from 'src/app/common/service/common/common.service';
import { AttedanceProfileComponent } from './attedance-profile/attedance-profile.component';
import { Api } from 'src/app/common/enum/enum';
import { AuthService } from 'src/app/common/service/authitication/auth.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
  imports: [CommonModule, SharedModule, AttedanceProfileComponent]
})
export default class AttendanceComponent implements AfterViewInit {
  @ViewChild('attedanceProfile') attedanceProfileComponent!: AttedanceProfileComponent;
  today: any;
  attendancelist: Attendance[];
  active: any;
  activeLink: any = 'list';
  from: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  to: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  private timerSubscription: Subscription;
  attendanceButton: string;
  childAttendancelist: Attendance[];

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private authService: AuthService
  ) {
    this.GetAttedanceByDate();
  }
  async ngAfterViewInit(): Promise<void> {
    await this.GetAttedanceByDate();
  }
  JsonToCsv() {
    this.commonService.exportToCsv(this.attendancelist, `Attedance-${this.today}.csv`);
  }

  async checkIn() {
    await this.attedanceProfileComponent.checkIn();
    this.setAttendanceButton();
  }

  async setChildList(employeeId) {
    this.childAttendancelist = this.attendancelist
      .filter((x) => x.EmployeeId === employeeId)
      .sort((a, b) => new Date(a.CreatedDateTime).getTime() - new Date(b.CreatedDateTime).getTime());
  }

  async checkOut() {
    if (this.attedanceProfileComponent) {
      await this.attedanceProfileComponent.checkOut();
      this.setAttendanceButton();
    } else {
      console.error('AttendanceProfileComponent is not available');
    }
  }

  GetAttedanceByDate() {
    this.apiService.getByDate(Api.Attendance, new RequestDto(null, this.from, this.to)).subscribe((data) => {
      this.attendancelist = data;
      this.setAttendanceButton();
    });
  }

  calculateWorkedTime(inTime: any, outTime: any) {
    !outTime ? (outTime = new Date()) : (outTime = new Date(outTime));
    const diffMs = new Date(outTime).getTime() - new Date(inTime).getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${hours}:${minutes}:${seconds}`;
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private async setAttendanceButton(): Promise<void> {
    const { email: currentUserEmail } = await this.authService.decodeObjectFromBase64(localStorage.getItem('jwt'));
    this.attendanceButton = this.attendancelist.some((x) => x.Employee.CompanyEmail === currentUserEmail && x.OutTime === null)
      ? 'OutTime'
      : 'InTime';
  }
}

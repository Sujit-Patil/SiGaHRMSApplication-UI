import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '../module/shared.module';
import { Holiday, RequestDto } from '../../datatypes/DataTypes';
import { ApiService } from '../../service/api/api-service.service';
import { Api, UserRole } from '../../enum/enum';
import { AlertService } from '../../service/alert/alert.service';
import { AuthService } from '../../service/authitication/auth.service';

@Component({
  selector: 'app-holiday',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss']
})
export default class HolidayComponent {
  holidays: Holiday[];
  userRole = UserRole;
  from: any = this.datePipe.transform(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd');
  to: any = this.datePipe.transform(new Date(new Date().getFullYear(), 11, 31), 'yyyy-MM-dd');
  currentUser: any;

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private alertService: AlertService,
    private authService: AuthService
  ) {
    this.getHoliday();
    this.currentUser = this.authService.decodeObjectFromBase64(localStorage.getItem('jwt'));
  }

  getHoliday() {
    this.apiService.getByDate(Api.Holiday, new RequestDto(null, this.from, this.to)).subscribe((data) => {
      this.holidays = data;
    });
  }
  async addHoliday() {
    var holiday = new Holiday();
    await this.alertService.HolidayFromAlert(holiday);
    if (holiday.Date != '' && holiday.Description != '') {
      this.apiService.post(Api.Holiday, holiday).subscribe((data) => {
        if (data.IsValid) {
          this.alertService
            .Toast()
            .fire({ icon: 'success', title: 'New Holiday Added Successfully' })
            .then((data) => (data.dismiss ? this.getHoliday() : ''));
        }
      });
    }
  }

  async updateHoliday(holiday: Holiday) {
    await this.alertService.HolidayFromAlert(holiday);
    if (holiday.Date != '' && holiday.Description != '') {
      this.apiService.update(Api.Holiday, holiday).subscribe((data) => {
        if (data.IsValid) {
          this.alertService
            .Toast()
            .fire({ icon: 'success', title: 'Holiday Updated Successfully' })
            .then((data) => (data.dismiss ? this.getHoliday() : ''));
        }
      });
    }
  }

  async deleteHoliday(holiday: Holiday) {
    this.apiService.update(Api.Holiday, holiday).subscribe((data) => {
      if (data.IsValid) {
        this.alertService
          .Toast()
          .fire({ icon: 'error', title: 'Holiday deleted Successfully' })
          .then((data) => (data.dismiss ? this.getHoliday() : ''));
      }
    });
  }
}

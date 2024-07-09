import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '../module/shared.module';

@Component({
  selector: 'app-holiday',
  standalone:true,
  imports:[CommonModule,SharedModule],
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss']
})
export default class HolidayComponent {

}

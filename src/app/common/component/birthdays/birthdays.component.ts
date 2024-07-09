import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '../module/shared.module';

@Component({
  selector: 'app-birthdays',
  standalone:true,
  imports:[CommonModule,SharedModule],
  templateUrl: './birthdays.component.html',
  styleUrls: ['./birthdays.component.scss']
})
export default class BirthdaysComponent {

}

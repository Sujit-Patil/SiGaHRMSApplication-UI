import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '../module/shared.module';

@Component({
  selector: 'app-events',
  standalone:true,
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  imports: [CommonModule, SharedModule]
})
export default class EventsComponent {

}

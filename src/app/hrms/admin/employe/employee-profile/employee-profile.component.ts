import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';

@Component({
  selector: 'app-employee-profile',
  standalone:true,
  imports:[CommonModule,SharedModule],
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent {

  @Input() updateId:any;

  ngOnInit(){
    console.log(this.updateId);
    
  }
}

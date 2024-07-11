import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { LeaveBalance } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import LeavebalanceFormComponent from "./leavebalance-form/leavebalance-form.component";

@Component({
  selector: 'app-leavebalances',
  standalone:true,
  templateUrl: './leavebalances.component.html',
  styleUrls: ['./leavebalances.component.scss'],
  imports: [CommonModule, SharedModule, LeavebalanceFormComponent]
})
export default class LeavebalancesComponent {
  active: any;
  activeSection="list";
  leavebalances: LeaveBalance[] = [];
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getAll(Api.LeaveBalance).subscribe((data) => {
      this.leavebalances = data;
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Client } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { AlertService } from 'src/app/common/service/alert/alert.service';
import { ApiService } from 'src/app/common/service/api/api-service.service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export default class ClientComponent {
  clients: Client[] = [];
  active: any;

  constructor(
    private apiService: ApiService,
    private alertService: AlertService
  ) {
    this.getAllClient();
  }

  getAllClient() {
    this.apiService.getAll(Api.Client).subscribe((data) => {
      this.clients = data;
    });
  }

  async newClient() {
    var client = new Client();
    if ((await this.alertService.clientRequestAlert(client)).isConfirmed) {
      this.apiService.post(Api.Client, client).subscribe((data) => {
        data.IsValid?this.alertService
          .Toast()
          .fire({ icon: 'success', title: 'new Client Added Successfully' })
          .then((data) => (data.dismiss ? this.getAllClient() : '')):''
      });
    }
  }

  async updateClient(client:Client) {
    if ((await this.alertService.clientRequestAlert(client)).isConfirmed) {
      this.apiService.update(Api.Client, client).subscribe((data) => {
        data.IsValid?this.alertService
          .Toast()
          .fire({ icon: 'success', title: 'Client Updated Successfully' })
          .then((data) => (data.dismiss ? this.getAllClient() : '')):''
      });
    }
  }
}

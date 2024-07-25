import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { BillingPlatform, billingTypeOptions, Client, Project } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { AlertService } from 'src/app/common/service/alert/alert.service';
import { ApiService } from 'src/app/common/service/api/api-service.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export default class ProjectFormComponent implements OnInit {
  @Input() updateId: Project;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  project: Project = new Project();
  billingPlatform: BillingPlatform[] = [];
  billingType = billingTypeOptions;
  clients: Client[] = [];

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    if (this.updateId) {
      this.project = this.updateId;
    }
    this.getOptions();
  }

  notifyParent(title) {
    this.alertService
      .Toast()
      .fire({ icon: 'success', title: title })
      .then((data) => (data.dismiss ? this.notify.emit('list') : ''));
  }
  addProject() {
    this.project.BillingPlatformId = Number(this.project.BillingPlatformId);
    this.project.ClientId = Number(this.project.ClientId);
    console.log(this.project);

    this.apiService
      .post(Api.Project, this.project)
      .subscribe((data) => (data.IsValid ? this.notifyParent('New Project Added Successfully') : ''));
  }

  updateProject() {
    this.apiService
      .update(Api.Project, this.project)
      .subscribe((data) => (data.IsValid ? this.notifyParent('Project Updated Successfully') : ''));
  }

  getOptions() {
    this.apiService.getAll(Api.BillingPlatform).subscribe((data) => {
      this.billingPlatform = data;
    });
    this.apiService.getAll(Api.Client).subscribe((data) => {
      this.clients = data;
      console.log(this.clients);
    });
  }
}

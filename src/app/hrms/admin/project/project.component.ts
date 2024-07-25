import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Project } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import ProjectFormComponent from './project-form/project-form.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [SharedModule, CommonModule, ProjectFormComponent],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export default class ProjectComponent {
  actionLink: any = 'list';
  projects: Project[];
  active: any;
  from: any;
  to: any;
updateId: any;

  constructor(private apiService: ApiService) {
    this.getProjects();
  }
  getProjects() {
    this.apiService.getAll(Api.Project).subscribe((data) => {
      this.projects = data;
    });
  }
  handleNotification(activeSection: string) {
    this.getProjects();
    this.actionLink = activeSection;
  }
}

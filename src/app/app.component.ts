import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResumeComponent } from "./components/resume/resume.component";
import { CreateResumeComponent } from "./components/create-resume/create-resume.component";

@Component({
  selector: 'app-root',
  imports: [ResumeComponent, CreateResumeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ResumeCreatorFrontend';
}

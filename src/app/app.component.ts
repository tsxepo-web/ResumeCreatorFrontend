import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateResumeComponent } from './components/create-resume/create-resume.component';

@Component({
  selector: 'app-root',
  imports: [CreateResumeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ResumeCreatorFrontend';
}

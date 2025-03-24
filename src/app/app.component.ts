import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResumeComponent } from './components/resume/resume.component';

@Component({
  selector: 'app-root',
  imports: [ResumeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Resume Creator';
}

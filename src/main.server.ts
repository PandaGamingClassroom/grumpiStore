import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [provideHttpClient()],
  });

export default bootstrap;

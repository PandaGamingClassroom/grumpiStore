import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { config } from './app/app.config.server';


const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [
      ...config.providers, // Aquí se incluyen los proveedores de la configuración
      provideHttpClient(), // Asegúrate de que HttpClient esté incluido
    ],
  });

export default bootstrap;

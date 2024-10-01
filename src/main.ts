import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

// Función para ocultar la pantalla de carga después de un tiempo
function hideSplashScreen() {
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    setTimeout(() => {
      splashScreen.style.display = 'none';
    }, 5000); // 2000 ms (2 segundos)
  }
}

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), ...appConfig.providers],
})
  .then(() => {
    hideSplashScreen();
  })
  .catch((err) => console.error(err));

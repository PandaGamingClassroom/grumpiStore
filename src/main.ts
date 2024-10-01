import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { inject } from '@angular/core';

// Función para ocultar la pantalla de carga después de un tiempo
function hideSplashScreen() {
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    setTimeout(() => {
      splashScreen.style.display = 'none';
    }, 5000); // 2000 ms (2 segundos)
  }
}

// Función para activar y verificar actualizaciones usando `versionUpdates`
function checkForUpdates(swUpdate: SwUpdate) {
  swUpdate.versionUpdates.subscribe((event) => {
    if (event.type === 'VERSION_READY') {
      if (confirm('Nueva versión disponible. ¿Actualizar ahora?')) {
        window.location.reload();
      }
    }
  });
}

// Bootstrap de la aplicación Angular
bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), ...appConfig.providers],
})
  .then(() => {
    hideSplashScreen();

    // Comprobar actualizaciones si hay soporte para service workers
    const swUpdate = inject(SwUpdate);
    if (swUpdate.isEnabled) {
      checkForUpdates(swUpdate);
    }
  })
  .catch((err) => console.error(err));

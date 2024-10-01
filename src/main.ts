import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationRef } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';

// Función para ocultar la pantalla de carga después de un tiempo
function hideSplashScreen() {
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    setTimeout(() => {
      splashScreen.style.display = 'none';
    }, 3000);
  }
}

// Función para activar y verificar actualizaciones usando `SwUpdate`
function checkForUpdates(swUpdate: SwUpdate) {
  swUpdate.versionUpdates.subscribe((event: VersionEvent) => {
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
  .then((appRef: ApplicationRef) => {
    hideSplashScreen();

    // Comprobar actualizaciones si hay soporte para service workers
    const swUpdate = appRef.injector.get(SwUpdate, null);
    if (swUpdate?.isEnabled) {
      checkForUpdates(swUpdate);
    }
  })
  .catch((err) => console.error('Error al inicializar la aplicación:', err));

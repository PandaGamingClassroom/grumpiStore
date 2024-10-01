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

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 3000);
  }
}

// Función para activar y verificar actualizaciones usando `SwUpdate`
function checkForUpdates(swUpdate: SwUpdate) {
  // Monitorizar eventos de actualizaciones de versiones
  swUpdate.versionUpdates.subscribe((event: VersionEvent) => {
    if (event.type === 'VERSION_READY') {
      if (confirm('Nueva versión disponible. ¿Actualizar ahora?')) {
        window.location.reload();
      }
    }
  });

  // Verificar manualmente si hay una actualización disponible
  swUpdate.checkForUpdate().then(hasUpdate => {
    if (hasUpdate) {
      console.log('Nueva versión encontrada');
    } else {
      console.log('No hay nuevas actualizaciones disponibles');
    }
  }).catch(err => console.error('Error verificando actualizaciones:', err));
}

// Función para comprobar actualizaciones manualmente, que puedes conectar a un botón o similar
function checkForManualUpdates(swUpdate: SwUpdate) {
  swUpdate.checkForUpdate().then(hasUpdate => {
    if (hasUpdate && confirm('Nueva versión disponible. ¿Actualizar ahora?')) {
      window.location.reload();
    } else {
      console.log('No se encontraron nuevas actualizaciones');
    }
  }).catch(err => console.error('Error al buscar actualizaciones manualmente:', err));
}

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), ...appConfig.providers],
})
  .then((appRef: ApplicationRef) => {
    hideSplashScreen();
    hideLoadingScreen();
    const swUpdate = appRef.injector.get(SwUpdate, null);
    if (swUpdate?.isEnabled) {
      checkForUpdates(swUpdate);
    }
  })
  .catch((err) => console.error('Error al inicializar la aplicación:', err));

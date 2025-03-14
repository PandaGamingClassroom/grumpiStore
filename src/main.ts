import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent, HttpLoaderFactory } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationRef } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { importProvidersFrom } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

// Función para ocultar la pantalla de carga después de un tiempo
function hideLoadingAndSplashScreen() {
  const splashScreen = document.getElementById('splash-screen');
  const loadingScreen = document.getElementById('loading');

  // Comprueba si ambos elementos existen
  if (splashScreen && loadingScreen) {
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      splashScreen.style.display = 'none';
      splashScreen.style.pointerEvents = 'none';

      loadingScreen.remove();
      splashScreen.remove();
    }, 2000);
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
  providers: [
    provideHttpClient(),
    ...appConfig.providers,
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ],
})
  .then((appRef: ApplicationRef) => {
    hideLoadingAndSplashScreen();
    const swUpdate = appRef.injector.get(SwUpdate, null);
    if (swUpdate?.isEnabled) {
      checkForUpdates(swUpdate);
    }
  })
  .catch((err) => console.error('Error al inicializar la aplicación:', err));

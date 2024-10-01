import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { RouterLink } from '@angular/router';
import { SwUpdate, VersionEvent } from '@angular/service-worker';

@Component({
  selector: 'app-about-the-app',
  standalone: true,
  imports: [RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './about-the-app.component.html',
  styleUrls: ['./about-the-app.component.scss'],
})
export class AboutTheAppComponent {
  
  constructor(private swUpdate: SwUpdate) {}

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  /**
   * updateApp() && checkForManualUpdates() --> Son funciones
   * para actualizar manualmente la aplicación.
   */
  updateApp() {
    if (this.swUpdate.isEnabled) {
      this.checkForManualUpdates();
    } else {
      console.log('Service Worker no está habilitado.');
    }
  }

  checkForManualUpdates() {
    this.swUpdate.versionUpdates.subscribe((event: VersionEvent) => {
      if (event.type === 'VERSION_READY') {
        if (confirm('Nueva versión disponible. ¿Actualizar ahora?')) {
          window.location.reload(); 
        }
      }
    });
    this.swUpdate.checkForUpdate().then(hasUpdate => {
      if (!hasUpdate) {
        console.log('No se encontraron nuevas actualizaciones.');
      }
    }).catch(err => console.error('Error al buscar actualizaciones manualmente:', err));
  }
}

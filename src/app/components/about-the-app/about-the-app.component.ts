import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { RouterLink } from '@angular/router';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { ConfirmModalComponentComponent } from '../../segments/confirm-modal-component/confirm-modal-component.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-about-the-app',
  standalone: true,
  imports: [RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './about-the-app.component.html',
  styleUrls: ['./about-the-app.component.scss'],
})
export class AboutTheAppComponent implements OnInit {
  constructor(private swUpdate: SwUpdate, private dialog: MatDialog) {}

  ngOnInit(): void {}

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
        const data = {
          title: '¡Actualizando GrumpiApp!',
          message: 'Nueva versión disponible. ¿Actualizar ahora?',
        };
        this.openModal(data);
        window.location.reload();
      }
    });
    this.swUpdate
      .checkForUpdate()
      .then((hasUpdate) => {
        if (!hasUpdate) {
          const data = {
            title: '¡Actualizando GrumpiApp!',
            message: 'No se encontraron nuevas actualizaciones.',
          };
          this.openModal(data);
        }
      })
      .catch((err) =>
        console.error('Error al buscar actualizaciones manualmente:', err)
      );
  }

  openModal(data: any) {
    this.dialog.open(ConfirmModalComponentComponent, {
      width: '400px',
      height: '300px',
      data: data,
    });
  }
}

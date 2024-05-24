import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavBarAdminComponent } from './navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { FooterComponent } from '../footer/footer.component';
import { GrumpidolarsComponent } from './grumpidolars/grumpidolars.component';
import { MatDialog } from '@angular/material/dialog';
import { EnergiesComponent } from './energies/energies.component';

@Component({
  selector: 'app-admin-screen',
  standalone: true,
  imports: [RouterLink, NavBarAdminComponent, FooterComponent],
  templateUrl: './admin-screen.component.html',
  styleUrl: './admin-screen.component.scss',
})
export class AdminScreenComponent implements OnInit {
  userData: any;
  modalAbierta = false;
  confirmMessage: string = 'Grumpi añadido correctamente.';

  constructor(private routes: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit() {
    // Obtener los datos de la ruta
    this.routes.params.subscribe((params) => {
      this.userData = params['data'];
    });
  }

  openModal() {
    if (!this.modalAbierta) {
      const data = {
        title: '¡Grumpi guardado correctamente!',
        message: this.confirmMessage,
      };

      const dialogRef = this.dialog.open(GrumpidolarsComponent, {
        width: '600px',
        height: '500px',
        data: data,
      });
      dialogRef.afterClosed().subscribe((result) => {
        window.location.reload();
      });
      this.modalAbierta = true;
    }
  }

  openWindowEnergies() {
    if (!this.modalAbierta) {
      const data = {
        title: '¡Grumpi guardado correctamente!',
        message: this.confirmMessage,
      };

      const dialogRef = this.dialog.open(EnergiesComponent, {
        width: '600px',
        height: '500px',
        data: data,
      });
      dialogRef.afterClosed().subscribe((result) => {
        window.location.reload();
      });
      this.modalAbierta = true;
    }
  }
}

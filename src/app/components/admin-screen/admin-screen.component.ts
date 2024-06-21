import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavBarAdminComponent } from './navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { FooterComponent } from '../footer/footer.component';
import { GrumpidolarsComponent } from './grumpidolars/grumpidolars.component';
import { MatDialog } from '@angular/material/dialog';
import { EnergiesComponent } from './energies/energies.component';
import { TrainerService } from '../services/trainers/trainer.service';
import { CommonModule } from '@angular/common';
import { TrainersAdminComponent } from './trainers/trainers-admin/trainers-admin.component';
import { MedalsAdminScreenComponent } from './medals/medals-admin-screen.component';
import { LeagueBadgesComponent } from './league-badges/league-badges.component';
import { CreaturesAdminComponent } from './creatures/creatures-admin.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-screen',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    NavBarAdminComponent,
    FooterComponent,
    TrainersAdminComponent,
    MedalsAdminScreenComponent,
    LeagueBadgesComponent,
    GrumpidolarsComponent,
    EnergiesComponent,
    CreaturesAdminComponent,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    FooterComponent
  ],
  providers: [TrainerService],
  templateUrl: './admin-screen.component.html',
  styleUrl: './admin-screen.component.scss',
})
export class AdminScreenComponent implements OnInit {
  userData: any;
  username: any;
  modalAbierta = false;
  confirmMessage: string = 'Grumpi añadido correctamente.';
  profesor: any;
  trainers: any[] = [];
  nameProfesor: any;
  lastNameProfesor: any;
  activeSection: string | null = null;


  constructor(
    private routes: ActivatedRoute,
    private dialog: MatDialog,
    private trainersService: TrainerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obtener los datos de la ruta
    if (typeof window !== 'undefined') {
      // Verifica si `window` está definido
      this.username = localStorage.getItem('username');
      this.nameProfesor = localStorage.getItem('nameUser');
      this.lastNameProfesor = localStorage.getItem('lastNameUser');
      this.getDadataProfesor(this.nameProfesor);
    }
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

  getDadataProfesor(name: string) {
    this.trainersService.getProfesorByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message); // Maneja el mensaje de "Profesor no encontrado"
        } else {
          this.profesor = data;
          this.lastNameProfesor = data.data.apellidos;
          this.getEntrenadores(data.data.id);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getEntrenadores(profesorId: number) {
    this.trainersService.getEntrenadoresByProfesorId(profesorId).subscribe(
      (data) => {
        this.trainers = data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  showSection(section: string) {
    this.activeSection = section;
  }
}

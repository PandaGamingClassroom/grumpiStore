import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TrainerService } from '../../services/trainers/trainer.service';
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { FooterComponent } from '../../footer/footer.component';
import { GrumpidolarsComponent } from '../grumpidolars/grumpidolars.component';
import { EnergiesComponent } from '../energies/energies.component';
import { TrainersManagementComponent } from './trainers-management/trainers-management.component';
import { MedalsManagementComponent } from './medals-management/medals-management.component';
import { LeagueBadgesManagementComponent } from './league-badges-management/league-badges-management.component';
import { CreaturesManagementComponent } from './creatures-management/creatures-management.component';
import { EnergiesManagementComponent } from './energies-management/energies-management.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-management',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    NavBarAdminComponent,
    FooterComponent,
    TrainersManagementComponent,
    MedalsManagementComponent,
    LeagueBadgesManagementComponent,
    GrumpidolarsComponent,
    EnergiesManagementComponent,
    CreaturesManagementComponent,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [TrainerService],
  templateUrl: './management.component.html',
  styleUrl: './management.component.scss',
})
export class ManagementComponent implements OnInit {
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
  showSection(section: string) {
    this.activeSection = section;
  }
}

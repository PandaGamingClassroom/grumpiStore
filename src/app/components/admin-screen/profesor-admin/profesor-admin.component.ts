import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { TrainerService } from '../../services/trainers/trainer.service';
import { AddTrainersComponent } from '../trainers/add-trainers/add-trainers.component';
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { FooterComponent } from '../../footer/footer.component';
import { SeeProfesorsComponent } from './see-profesor/see-profesors.component';
import { EditCompleteDataProfesorComponent } from './edit-complete-dataProfesor/edit-complete-dataProfesor.component';
import { DeleteProfessorsComponent } from './delete-professors/delete-professors.component';

@Component({
  selector: 'app-profesor-admin',
  standalone: true,
  imports: [
    RouterLink,
    NavBarAdminComponent,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    FooterComponent,
  ],
  providers: [TrainerService],
  templateUrl: './profesor-admin.component.html',
  styleUrls: ['./profesor-admin.component.scss'],
})
export class ProfesorAdmin implements OnInit {
  trainers: any[] = [];
  errorGetTrainers: string = 'No se han encontrado profesores';
  errorGetProfesors: string = 'No se han encontrado profesores';
  getError: boolean = false;
  trainerSelected: string = '';
  profesor: any;
  username: any;
  nameProfesor: any;
  lastNameProfesor: any;
  profesors: any[] = [];
  loading: boolean = true;

  constructor(
    private trainersService: TrainerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.nameProfesor = localStorage.getItem('nameUser');
    this.getDadataProfesor(this.nameProfesor);
    this.getAllProfesors();
  }

  getDadataProfesor(name: string) {
    this.trainersService.getProfesorByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message); // Maneja el mensaje de "Profesor no encontrado"
        } else {
          this.profesor = data.data;
          this.lastNameProfesor = data.data.apellidos;
          this.getEntrenadores(data.data.id);
        }
      },
      (error) => {
        console.error('Error:', error);
        this.loading = false; 
      }
    );
  }

  /**
   * Función para obtener el listado completo de profesores
   * que están dados de alta.
   */
  getAllProfesors() {
    this.trainersService.getProfesores().subscribe(
      (data: any) => {
        console.log('Listado de profesores: ', data);

        this.profesors = data.profesoresList;
        this.loading = false; 
      },
      (error) => {
        console.error('Error:', error);
        this.loading = false; 
      }
    );
  }

  getEntrenadores(profesorId: number) {
    this.trainersService.getEntrenadoresByProfesorId(profesorId).subscribe(
      (data) => {
        this.trainers = data.data;
        this.loading = false; 
      },
      (error) => {
        console.error('Error:', error);
        this.loading = false; 
      }
    );
  }

  selectTrainer(trainer: string) {
    this.trainerSelected = trainer;
  }

  /**
   * Función para abrir una ventana emergente en la cual se va a poder
   * editar la información del entrenador seleccionado.
   *
   * @param trainer Recibe el entrenador seleccionado.
   */
  openEditPage(trainer: any) {
    const dialogRef = this.dialog.open(EditCompleteDataProfesorComponent, {
      width: '700px',
      height: '600px',
      data: trainer,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllProfesors(); // Actualiza la lista de entrenadores después de cerrar el modal
    });
  }

  /**
   * Función para abrir la ventana modal en la que se va a mostrar la información
   * de un entrenador seleccionado.ç
   *
   * En esta ventana solo se podrá visualizar la información
   * No se va a poder editar nada.
   *
   * @param trainer Recibe el entrenador seleccionado.
   */
  openSeeProfesors(trainer: any) {
    const dialogRef = this.dialog.open(SeeProfesorsComponent, {
      width: '700px',
      height: '600px',
      data: trainer,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllProfesors(); // Actualiza la lista de entrenadores después de cerrar el modal
    });
  }

  /**
   * Función para abrir una ventana emergente en la cual
   * se puede añadir un entrenador nuevo a la lista de entrenadores del profesor.
   */
  openAddTrainerModal(): void {
    const dialogRef = this.dialog.open(AddTrainersComponent, {
      width: '700px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Nuevo entrenador:', result);
        this.getEntrenadores(this.profesor.id);
      }
    });
  }

  /**
   * Función para abrir una ventana emergente en la cual se elimina al entrenador seleccionado.
   *
   * @param trainer Recibe el entrenador que se ha seleccionado
   */
  openDeleteTrainerModal(trainer: any) {
    const dialogRef = this.dialog.open(DeleteProfessorsComponent, {
      width: '400px',
      height: '300px',
      data: trainer,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getEntrenadores(this.profesor.id);
      }
    });
  }
}

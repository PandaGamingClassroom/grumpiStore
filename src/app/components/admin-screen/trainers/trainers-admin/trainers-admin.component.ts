import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { TrainersEditComponent } from '../trainers-edit/trainers-edit.component';
import { ConfirmModalComponentComponent } from '../../../../segments/confirm-modal-component/confirm-modal-component.component';
import { TrainerService } from '../../../services/trainers/trainer.service';
import { AddTrainersComponent } from '../add-trainers/add-trainers.component';
import { DeleteTrainersComponent } from '../delete-trainers/delete-trainers.component';
import { SeeTrainersComponent } from '../see-trainers/see-trainers.component';

@Component({
  selector: 'app-trainers-admin',
  standalone: true,
  imports: [
    RouterLink,
    NavBarAdminComponent,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
  ],
  providers: [TrainerService],
  templateUrl: './trainers-admin.component.html',
  styleUrls: ['./trainers-admin.component.scss'],
})
export class TrainersAdminComponent implements OnInit {
  trainers: any[] = [];
  errorGetTrainers: string = 'No se han encontrado entrenadores';
  getError: boolean = false;
  trainerSelected: string = '';
  profesor: any;
  username: any;
  nameProfesor: any;
  lastNameProfesor: any;

  constructor(
    private trainersService: TrainerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.nameProfesor = localStorage.getItem('nameUser');
    this.getDadataProfesor(this.nameProfesor);
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
      }
    );
  }

  getEntrenadores(profesorId: number) {
    this.trainersService.getEntrenadoresByProfesorId(profesorId).subscribe(
      (data) => {
        this.trainers = data.data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  guardarEntrenador(nuevoAlumnoNombre: any, nuevaPass: any) {
    const nuevoEntrenador = {
      name: nuevoAlumnoNombre,
      password: nuevaPass,
      id_profesor: this.profesor.id,
    };

    this.trainersService.postTrainer(nuevoEntrenador).subscribe(
      (response) => {
        const data = {
          title: '¡Correcto!',
          message: 'El entrenador se ha añadido correctamente.',
        };
        const dialogRef = this.dialog.open(ConfirmModalComponentComponent, {
          width: '400px',
          height: '300px',
          data: data,
        });

        dialogRef.afterClosed().subscribe(() => {
          this.getEntrenadores(this.profesor.id); // Actualiza la lista de entrenadores después de cerrar el modal
        });
      },
      (error) => {
        console.error('Error al agregar el entrenador:', error);
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
   * @param trainer REcibe el entrenador seleccionado.
   */
  openEditPage(trainer: any) {
    const dialogRef = this.dialog.open(TrainersEditComponent, {
      width: '700px',
      height: '600px',
      data: trainer,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getEntrenadores(this.profesor.id); // Actualiza la lista de entrenadores después de cerrar el modal
    });
  }

  openSeeTrainers(trainer: any) {
    const dialogRef = this.dialog.open(SeeTrainersComponent, {
      width: '700px',
      height: '600px',
      data: trainer,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getEntrenadores(this.profesor.id); // Actualiza la lista de entrenadores después de cerrar el modal
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
    const dialogRef = this.dialog.open(DeleteTrainersComponent, {
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

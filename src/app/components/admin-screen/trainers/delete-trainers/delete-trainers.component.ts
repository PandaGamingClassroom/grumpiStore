import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../../services/trainers/trainer.service';
import { ConfirmModalComponentComponent } from '../../../../segments/confirm-modal-component/confirm-modal-component.component';

@Component({
  selector: 'app-delete-trainers',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
  ],
  providers: [TrainerService],
  templateUrl: './delete-trainers.component.html',
  styleUrl: './delete-trainers.component.scss',
})
export class DeleteTrainersComponent implements OnInit {
  trainerSelected: string = '';
  trainers: any[] = [];
  profesor: any;
  username: any;
  nameProfesor: any;
  lastNameProfesor: any;

  constructor(
    private trainersService: TrainerService,
    public dialogRef: MatDialogRef<DeleteTrainersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.nameProfesor = localStorage.getItem('nameUser');
    this.getDadataProfesor(this.nameProfesor);
    this.trainerSelected = this.data.name;
  }
  /**
   *
   * Función para obtener los datos de un profesor.
   *
   * @param name Recibe el nombre del profesor.
   */
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

  /**
   *
   * Función para eliminar el entrenador seleccionado.
   *
   * @returns Solo devuelve un error.
   */
  deleteTrainer() {
    console.log('Entrenador a eliminar: ', this.trainerSelected);

    const trainerToDelete = this.trainers.find(
      (trainer) => trainer.name === this.trainerSelected
    );

    if (!trainerToDelete) {
      console.error('No se encontró el entrenador a eliminar');
      return;
    }

    this.trainersService.eliminarRegistro(trainerToDelete.name).subscribe(
      () => {
        this.dialog
          .open(ConfirmModalComponentComponent, {
            width: '400px',
            height: '300px',
            data: {
              title: '¡Eliminando entrenador!',
              message: 'El entrenador se ha eliminado correctamente.',
            },
          })
          .afterClosed()
          .subscribe(() => {
            this.dialogRef.close(true);
          });
      },
      (error) => {
        console.error('Error al eliminar el registro:', error);
      }
    );
  }

  /**
   *
   * Función para obtener la información de los entrenadores
   * de un profesor.
   *
   * @param profesorId Recibe el id del profesor.
   */
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

  close() {
    this.dialogRef.close();
  }
}

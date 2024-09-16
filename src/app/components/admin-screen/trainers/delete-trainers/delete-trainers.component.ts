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
import { ErrorLoginModalComponentComponent } from '../../../../segments/error-login-modal-component/error-login-modal-component.component';

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
    const titleError = 'Algo ha salido mal';
    const messageError = 'No se encontró el entrenador a eliminar';

    const trainerToDelete = this.trainers.find(
      (trainer) => trainer.name === this.trainerSelected
    );

    if (!trainerToDelete) {
      this.openErrorModal(titleError, messageError);
    }

    this.trainersService.eliminarRegistro(trainerToDelete.name).subscribe(
      (response) => {
        const data = {
          title: '¡Correcto!',
          message: `El entrenador se ha eliminado correctamente.`,
        };
        this.dialog
          .open(ConfirmModalComponentComponent, {
            width: '400px',
            height: '250px',
            data: data,
          })
          .afterClosed()
          .subscribe(() => {
            this.dialogRef.close(trainerToDelete);
          });
      },
      (error) => {
        console.error('Error al eliminar el entrenador:', error);
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

  /**
   *
   * Función para mostrar ventana emergente con el error ocurrido.
   *
   * @param title Recibe el título para mostrar en la ventana de error.
   * @param message Recibe el mensaje para mostrar en la ventana de error.
   */
  openErrorModal(title: string, message: string) {
    const data = {
      title: title,
      message: message,
    };
    const dialogRef = this.dialog.open(ErrorLoginModalComponentComponent, {
      width: '400px',
      height: '300px',
      data: data,
    });
    dialogRef.afterClosed().subscribe();
  }
}

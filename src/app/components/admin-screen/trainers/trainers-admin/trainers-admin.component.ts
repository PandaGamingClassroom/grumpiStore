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
  trainer_list: any;
  trainers: any[] = [];
  errorGetTrainers: string = 'No se han encontrado entrenadores';
  confirmMessage: string = 'Entrenador agregado correctamente';
  confirmMessageBoolean: boolean = false;
  getError: boolean = false;
  trainerSelected: string = '';

  constructor(
    private trainersService: TrainerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getTrainers();
  }

  /**
   * Función para obtener la lista completa de entrenadores
   */
  getTrainers() {
    this.trainersService.getTrainers().subscribe((data: any) => {
      // Verifica si el objeto de datos recibido tiene la propiedad 'trainer_list'
      if (data && data.trainer_list) {
        this.trainers = data.trainer_list;
        this.getError = this.trainers.length === 0;
      } else {
        // Si el objeto de datos no tiene la propiedad 'trainer_list', establece un error
        this.getError = true;
      }
      console.log('Entrenadores: ', this.trainers);
    });
  }

  /**
   * Función para guardar los datos de un nuevo entrenador
   * @param nuevoAlumnoNombre
   * @param nuevaPass
   */
  guardarEntrenador(nuevoAlumnoNombre: any, nuevaPass: any) {
    this.trainersService.postTrainer(nuevoAlumnoNombre, nuevaPass).subscribe(
      (response) => {
        const data = {
          title: '¡Correcto!',
          message: 'El entrenador se ha añadido correctamente.',
        };
        const dialogRef = this.dialog.open(ConfirmModalComponentComponent, {
          width: '400px', // Ancho de la ventana modal
          height: '300px', // Alto de la ventana modal
          data: data,
        });
        // Puedes realizar acciones después de que se cierre la modal si lo deseas
        dialogRef.afterClosed().subscribe((result) => {
          console.log('La modal se ha cerrado');
          window.location.reload();
        });
      },
      (error) => {
        console.error('Error al agregar el entrenador:', error);
      }
    );
  }

  /**
   * Función para seleccionar un entrenador de la lista.
   * @param trainer entrenador seleccionado
   */
  selectTrainer(trainer: string) {
    this.trainerSelected = trainer;
  }

  deleteTrainer() {
    const trainerToDelete = this.trainers.find(
      (trainer) => trainer.name === this.trainerSelected
    );

    if (!trainerToDelete) {
      console.error('No se encontró el entrenador a eliminar');
      return;
    }

    this.trainersService.eliminarRegistro(trainerToDelete.name).subscribe(
      () => {
        console.log('Entrenador eliminado correctamente');
        // Obtener la lista actualizada de entrenadores después de eliminar
        this.getTrainers();
      },
      (error) => {
        console.error('Error al eliminar el registro:', error);
      }
    );
  }

  openEditPage(trainer: any) {
    console.log('Entrenador a editar: ', trainer);

    const dialogRef = this.dialog.open(TrainersEditComponent, {
      width: '700px', // Ancho de la ventana modal
      height: '600px', // Alto de la ventana modal
      data: trainer,
    });
    // Puedes realizar acciones después de que se cierre la modal si lo deseas
    dialogRef.afterClosed().subscribe((result) => {
      console.log('La modal se ha cerrado');
      window.location.reload();
    });
  }
}

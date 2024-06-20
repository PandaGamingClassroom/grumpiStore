import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../../services/trainers/trainer.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { RouterLink } from '@angular/router';
import { TrainersEditComponent } from '../../trainers/trainers-edit/trainers-edit.component';
import { ConfirmModalComponentComponent } from '../../../../segments/confirm-modal-component/confirm-modal-component.component';

@Component({
  selector: 'app-trainers-management',
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
  templateUrl: './trainers-management.component.html',
  styleUrl: './trainers-management.component.scss',
})
export class TrainersManagementComponent implements OnInit {
  trainer_list: any;
  trainers: any[] = [];
  errorGetTrainers: string = 'No se han encontrado entrenadores';
  confirmMessage: string = 'Entrenador agregado correctamente';
  confirmMessageBoolean: boolean = false;
  getError: boolean = false;
  trainerSelected: string = '';
  nameProfesor: any;
  lastNameProfesor: any;
  profesor: any;
  username: any;

  constructor(
    private trainersService: TrainerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      // Verifica si `window` está definido
      this.username = localStorage.getItem('username');
      this.nameProfesor = localStorage.getItem('nameUser');
      this.getDadataProfesor(this.nameProfesor);
    }
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
     const nuevoEntrenador = {
       name: nuevoAlumnoNombre,
       password: nuevaPass,
       id_profesor: this.profesor.data.id, // Asegúrate de que el profesor esté cargado
     };

     this.trainersService.postTrainer(nuevoEntrenador).subscribe(
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
        this.trainers = data.data;
        console.log('Entrenadores del profesor: ', this.trainers);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../../services/trainers/trainer.service';
import { MessageModalComponent } from '../../../../segments/message-modal-component/message-modal.component';

@Component({
  selector: 'app-select-trainer',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  providers: [TrainerService],
  templateUrl: './select-trainer.component.html',
  styleUrls: ['./select-trainer.component.scss'],
})
export class SelectTrainerComponent implements OnInit {
  trainerList: any[] = [];
  selectedTrainer: string | null = null;
  profesor: any;
  lastNameProfesor: any;
  nameProfesor: any;
  username: any;
  @Output() selectedTrainerName = new EventEmitter<any>();

  constructor(
    private trainersService: TrainerService,
    public dialogRef: MatDialogRef<SelectTrainerComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data_receive: any
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      // Verifica si `window` está definido
      this.username = localStorage.getItem('username');
      this.nameProfesor = localStorage.getItem('nameUser');
      this.getDadataProfesor(this.nameProfesor);
    }
  }

  /**
   * Función para obtener los datos del profesor que ha iniciado sesión.
   *
   * @param name --> Nombre del profesor.
   */
  getDadataProfesor(name: string) {
    this.trainersService.getProfesorByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message); // Maneja el mensaje de "Profesor no encontrado"
        } else {
          this.profesor = data;
          console.log('Profesor: ', this.profesor);
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
   * Función para obtener los datos de los entrenadores según su profesor.
   *
   * @param profesorId --> ID del profesor.
   */
  getEntrenadores(profesorId: number) {
    this.trainersService.getEntrenadoresByProfesorId(profesorId).subscribe(
      (data) => {
        this.trainerList = data.data;
        console.log('Entrenadores del profesor: ', this.trainerList);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  /**
   * Función para cerrar el componente actual.
   */
  close() {
    this.dialogRef.close();
  }

  /**
   *
   * Función para seleccionar a los entrenadores.
   * Una vez los entrenadores estén seleccionados, esta información
   * se envía al componente padre.
   */
  selectTrainer() {
    console.log('Grumpi recibido: ', this.data_receive);

    // Filtra los entrenadores que están seleccionados
    const selectedTrainers = this.trainerList.filter(
      (trainer) => trainer.selected
    );

    if (selectedTrainers.length > 0) {
      if (this.data_receive === null) {
        const selectedTrainerNames = selectedTrainers.map(
          (trainer) => trainer.name
        );

        // Emitir el array de nombres de entrenadores seleccionados
        this.selectedTrainerName.emit(selectedTrainerNames);

        // Cerrar el diálogo y pasar el array de nombres de entrenadores seleccionados como resultado
        this.dialogRef.close(selectedTrainerNames);
      } else {
        // ID del Grumpi que deseas agregar
        const grumpiIdToAdd = this.data_receive.id; // ID del Grumpi a verificar

        // Variable para verificar si algún entrenador ya tiene el Grumpi
        let canAddGrumpi = true;

        selectedTrainers.forEach((trainer) => {
          // Verificamos si el entrenador ya tiene el Grumpi en su lista
          const alreadyHasGrumpi = trainer.grumpis.some(
            (grumpi: any) => grumpi.id === grumpiIdToAdd
          );

          if (alreadyHasGrumpi) {
            canAddGrumpi = false;

            // Mostrar un mensaje de error para este entrenador
            const data = {
              title: '¡Ups, algo se está repitiendo!',
              message: `El entrenador ${trainer.name} ya tiene este Grumpi.`,
            };
            const dialogRef = this.dialog.open(MessageModalComponent, {
              width: '400px',
              height: '300px',
              data: data,
            });
            dialogRef.afterClosed().subscribe();
          }
        });

        // Si todos los entrenadores seleccionados pueden recibir el Grumpi
        if (canAddGrumpi) {
          const selectedTrainerNames = selectedTrainers.map(
            (trainer) => trainer.name
          );

          // Emitir el array de nombres de entrenadores seleccionados
          this.selectedTrainerName.emit(selectedTrainerNames);

          // Cerrar el diálogo y pasar el array de nombres de entrenadores seleccionados como resultado
          this.dialogRef.close(selectedTrainerNames);
        }
      }
    }
  }
}

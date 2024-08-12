import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../../services/trainers/trainer.service';

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
    public dialogRef: MatDialogRef<SelectTrainerComponent>
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
    // Filtra los entrenadores que están seleccionados
    const selectedTrainers = this.trainerList.filter(
      (trainer) => trainer.selected
    );

    if (selectedTrainers.length > 0) {
      // Mapea los nombres de los entrenadores seleccionados a un nuevo array
      const selectedTrainerNames = selectedTrainers.map(
        (trainer) => trainer.name
      );

      // Aquí agregamos la lógica para validar si ya tienen el Grumpi
      const grumpiIdToAdd = 1; // Aquí puedes establecer el ID del Grumpi que deseas agregar

      // Paso 2: Verificar si el Grumpi ya existe en la lista de grumpis de cada entrenador
      let canAddGrumpi = true; // Bandera para verificar si se puede añadir el Grumpi

      selectedTrainers.forEach((trainer) => {
        const alreadyHasGrumpi = trainer.grumpis.some(
          (grumpi: any) => grumpi.id === grumpiIdToAdd
        );

        if (alreadyHasGrumpi) {
          canAddGrumpi = false;
          console.error(`El entrenador ${trainer.name} ya tiene este Grumpi.`);
          alert(
            `Error: El entrenador ${trainer.name} ya tiene este Grumpi y no puede ser añadido nuevamente.`
          );
        }
      });

      // Si todos los entrenadores seleccionados pueden recibir el Grumpi, emitimos y cerramos el diálogo
      if (canAddGrumpi) {
        // Emite el array de nombres de entrenadores seleccionados
        this.selectedTrainerName.emit(selectedTrainerNames);

        // Cierra el diálogo y pasa el array de nombres de entrenadores seleccionados como resultado
        this.dialogRef.close(selectedTrainerNames);
      }
    }
  }
}

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
  isLoading: boolean = true; // Estado de carga
  @Output() selectedTrainerName = new EventEmitter<any>();

  constructor(
    private trainersService: TrainerService,
    public dialogRef: MatDialogRef<SelectTrainerComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data_receive: any
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.username = localStorage.getItem('username');
      this.nameProfesor = localStorage.getItem('nameUser');
      this.getDadataProfesor(this.nameProfesor);
    }
  }

  /**
   * 
   * Función para obtener los datos del profesor.
   * 
   * @param name Recibe el nombre del profesor
   */
  getDadataProfesor(name: string) {
    this.trainersService.getProfesorByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message);
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

 /**
  * 
  * Función para obtener la lista de entrenadores
  * del profesor que ha iniciado sesión.
  * 
  * @param profesorId Recibe el id del profesor.
  */
  getEntrenadores(profesorId: number) {
    this.trainersService.getEntrenadoresByProfesorId(profesorId).subscribe(
      (data) => {
        this.trainerList = data.data;
        this.isLoading = false;
        console.log('Entrenadores del profesor: ', this.trainerList);
      },
      (error) => {
        this.isLoading = false;
        console.error('Error:', error);
      }
    );
  }

  close() {
    this.dialogRef.close();
  }

  selectTrainer() {
    console.log('Grumpi recibido: ', this.data_receive);

    const selectedTrainers = this.trainerList.filter(
      (trainer) => trainer.selected
    );

    if (selectedTrainers.length > 0) {
      if (this.data_receive === null) {
        const selectedTrainerNames = selectedTrainers.map(
          (trainer) => trainer.id
        );

        this.selectedTrainerName.emit(selectedTrainerNames);
        this.dialogRef.close(selectedTrainerNames);
      } else {
        const grumpiIdToAdd = this.data_receive.id;

        let canAddGrumpi = true;

        selectedTrainers.forEach((trainer) => {
          const alreadyHasGrumpi = Array.isArray(trainer.grumpis) && trainer.grumpis.some(
            (grumpi: any) => grumpi.id === grumpiIdToAdd
          );

          if (alreadyHasGrumpi) {
            canAddGrumpi = false;
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

        if (canAddGrumpi) {
          const selectedTrainerNames = selectedTrainers.map(
            (trainer) => trainer.name
          );

          this.selectedTrainerName.emit(selectedTrainerNames);
          this.dialogRef.close(selectedTrainerNames);
        }
      }
    }
  }
}

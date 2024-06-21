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
  @Output() selectedTrainerName = new EventEmitter<string>();

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


  close() {
    this.dialogRef.close();
  }

  selectTrainer() {
    if (this.selectedTrainer) {
      this.selectedTrainerName.emit(this.selectedTrainer);
      this.dialogRef.close(this.selectedTrainer);
    }
  }
}

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../../services/trainers/trainer.service';

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

  constructor(
    private trainersService: TrainerService,
    public dialogRef: MatDialogRef<DeleteTrainersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log(this.data);

    this.trainerSelected = this.data.name;
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
        this.getEntrenadores(this.profesor.data.id); // Actualiza la lista de entrenadores después de eliminar
      },
      (error) => {
        console.error('Error al eliminar el registro:', error);
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

  close() {
    this.dialogRef.close();
  }
}

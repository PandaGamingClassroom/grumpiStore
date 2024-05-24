import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TrainerService } from '../../services/trainers/trainer.service';

@Component({
  selector: 'app-grumpidolars',
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
  templateUrl: './grumpidolars.component.html',
  styleUrl: './grumpidolars.component.scss',
})
export class GrumpidolarsComponent implements OnInit {
  trainerList: any[] = [];
  myForm: FormGroup;
  grumpidolar: number = 0;
  grumpidolaresPorEntrenador: { [key: string]: number } = {};

  constructor(
    private formBuilder: FormBuilder,
    private trainersService: TrainerService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<GrumpidolarsComponent>
  ) {
    this.myForm = this.formBuilder.group({
      grumpidolar: [''],
    });
    this.trainerList.forEach((trainer) => {
      this.grumpidolaresPorEntrenador[trainer.name] = 0;
    });
  }
  ngOnInit(): void {
    this.getTrainers();
  }

  getTrainers() {
    this.trainersService.getTrainers().subscribe(
      (response: any) => {
        if (Array.isArray(response.trainer_list)) {
          this.trainerList = response.trainer_list;
        } else {
          console.error(
            'Error: los datos de entrenadores no son un array:',
            response.trainer_list
          );
        }
      },
      (error) => {
        console.error('Error obteniendo los entrenadores:', error);
      }
    );
  }

  close() {
    this.dialogRef.close();
  }

  assignGrumpidolares(trainerName: string, grumpidolares: number): void {
  const grumpidolaresNumber = Number(grumpidolares);
  if (isNaN(grumpidolaresNumber) || grumpidolaresNumber <= 0) {
    console.error('Grumpidólares debe ser un número positivo.');
    return;
  }

  this.trainersService
    .assignGrumpidolaresToTrainer(trainerName, grumpidolaresNumber)
    .subscribe(
      (response) => {
        this.getTrainers();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}

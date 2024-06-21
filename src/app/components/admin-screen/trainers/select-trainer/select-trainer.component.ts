import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../../services/trainers/trainer.service';
import { GrumpiService } from '../../../services/grumpi/grumpi.service';

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
  providers: [GrumpiService, TrainerService],
  templateUrl: './select-trainer.component.html',
  styleUrls: ['./select-trainer.component.scss'],
})
export class SelectTrainerComponent implements OnInit {
  trainerList: any[] = [];
  selectedTrainer: string | null = null;
  @Output() selectedTrainerName = new EventEmitter<string>();

  constructor(
    private grumpiService: GrumpiService,
    private trainersService: TrainerService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<SelectTrainerComponent>
  ) {}

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

  selectTrainer() {
    if (this.selectedTrainer) {
      this.selectedTrainerName.emit(this.selectedTrainer);
      this.dialogRef.close(this.selectedTrainer);
    }
  }
}

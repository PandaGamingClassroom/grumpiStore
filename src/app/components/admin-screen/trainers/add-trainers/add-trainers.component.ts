import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../../services/trainers/trainer.service';
import { ConfirmModalComponentComponent } from '../../../../segments/confirm-modal-component/confirm-modal-component.component';

@Component({
  selector: 'app-add-trainers',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [TrainerService],
  templateUrl: './add-trainers.component.html',
  styleUrls: ['./add-trainers.component.scss'],
})
export class AddTrainersComponent implements OnInit {
  trainers: any[] = [];
  errorGetTrainers: string = 'No se han encontrado entrenadores';
  getError: boolean = false;
  trainerSelected: string = '';
  profesor: any;
  username: any;
  nameProfesor: any;
  lastNameProfesor: any;
  myForm: FormGroup;
  selectedRol: string | null = null;
  isTrainer: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private trainersService: TrainerService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddTrainersComponent>
  ) {
    this.myForm = this.formBuilder.group({
      trainer_name: ['', Validators.required],
      trainer_lastName: ['', Validators.required],
      trainer_pass: ['', Validators.required],
      trainer_rol: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.nameProfesor = localStorage.getItem('nameUser');
    this.getDataProfesor(this.nameProfesor);
  }

  selectedTrainerOrProfesor() {
    this.selectedRol = this.myForm.get('trainer_rol')?.value;
    this.isTrainer = this.selectedRol === 'entrenador';
  }

  getDataProfesor(name: string) {
    this.trainersService.getProfesorByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message);
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

  guardarEntrenador() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const nuevoUsuario = this.isTrainer
      ? {
          name: this.myForm.get('trainer_name')?.value,
          password: this.myForm.get('trainer_pass')?.value,
          rol: this.myForm.get('trainer_rol')?.value,
          id_profesor: this.profesor.id,
        }
      : {
          nombre: this.myForm.get('trainer_name')?.value,
          apellidos: this.myForm.get('trainer_lastName')?.value,
          usuario: this.myForm.get('trainer_name')?.value,
          password: this.myForm.get('trainer_pass')?.value,
          rol: this.myForm.get('trainer_rol')?.value,
          id_profesor: this.profesor.id,
        };

    this.trainersService.postTrainer(nuevoUsuario).subscribe(
      (response) => {
        const stringMessage = this.isTrainer ? 'entrenador' : 'profesor';
        const data = {
          title: '¡Correcto!',
          message: `El ${stringMessage} se ha añadido correctamente.`,
        };
        const dialogRef = this.dialog.open(ConfirmModalComponentComponent, {
          width: '400px',
          height: '300px',
          data: data,
        });

        dialogRef.afterClosed().subscribe(() => {
          this.getEntrenadores(this.profesor.id);
          window.location.reload();
        });
      },
      (error) => {
        console.error('Error al agregar el entrenador:', error);
      }
    );
  }

  close() {
    this.dialogRef.close();
  }
}

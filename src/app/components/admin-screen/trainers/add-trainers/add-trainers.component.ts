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
  styleUrl: './add-trainers.component.scss',
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

  constructor(
    private formBuilder: FormBuilder,
    private trainersService: TrainerService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddTrainersComponent>
  ) {
    this.myForm = this.formBuilder.group({
      trainer_name: ['', Validators.required],
      trainer_pass: ['', Validators.required],
      trainer_rol: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.nameProfesor = localStorage.getItem('nameUser');
    this.getDataProfesor(this.nameProfesor);
  }

  /**
   * Función para obtener la información de un profesor concreto.
   * En este caso el que ha iniciado sesión.
   *
   * @param name => Nombre del profesor que ha iniciado sesión en la App.
   */
  getDataProfesor(name: string) {
    this.trainersService.getProfesorByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message); // Maneja el mensaje de "Profesor no encontrado"
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

  /**
   * Función para obtener la información de los entrenadores
   * que hay actualmente en BBDD.
   *
   * @param profesorId
   */
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

  /**
   * Función para guardar los nuevos usuarios.
   * Se valida el tipo de rol que es el usuario para así,
   * envíar unos datos u otros a la API.
   */
  guardarEntrenador() {
    const trainerString = 'entrenador';
    const profesorString = 'profesor';
    let stringMessage = '';

    const nuevoEntrenador = {
      name: this.myForm.get('trainer_name')?.value,
      password: this.myForm.get('trainer_pass')?.value,
      rol: this.myForm.get('trainer_rol')?.value,
      id_profesor: this.profesor.id,
    };

    this.trainersService.postTrainer(nuevoEntrenador).subscribe(
      (response) => {
        if(nuevoEntrenador.rol === 'entrenador'){
          stringMessage = trainerString;
        } else if (nuevoEntrenador.rol === 'profesor') {
          stringMessage = profesorString;
        }
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
          this.getEntrenadores(this.profesor.id); // Actualiza la lista de entrenadores después de cerrar el modal
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

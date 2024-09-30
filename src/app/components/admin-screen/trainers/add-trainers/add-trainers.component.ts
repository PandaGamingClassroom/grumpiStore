import { CommonModule } from '@angular/common';
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
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
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
      avatar: ['', Validators.required],
      trainer_name: ['', Validators.required],
      trainer_lastName: ['', Validators.required],
      trainer_pass: ['', Validators.required],
      trainer_rol: ['', Validators.required],
      usuario: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.nameProfesor = localStorage.getItem('nameUser');
    this.getDataProfesor(this.nameProfesor);
  }

  /**
   * Función para validar si se está seleccionando
   * un profesor o un entrenador.
   */
  selectedTrainerOrProfesor() {
    this.selectedRol = this.myForm.get('trainer_rol')?.value;
    this.isTrainer = this.selectedRol === 'entrenador';
  }

  /**
   * Función para obtener los datos del profesor
   * que ha iniciado sesión.
   *
   * @param name Recibe el nombre del profesor.
   */
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

  /**
   * Función para obtener los entrenadores del profesor
   * que ha iniciado sesión.
   *
   * @param profesorId Recibe el id del profesor que está logueado en la aplicación.
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
   * Función para guardar un nuevo usuario
   * Se comprueba si es un entrenador o un profesor.
   */
  guardarEntrenador() {
    let exist = false;
    const username = this.myForm.get('trainer_name')?.value;

    // Verifica si el nombre de usuario ya existe entre los entrenadores o profesores
    this.trainers.forEach((trainer) => {
      if (trainer.name === username) {
        exist = true;
        this.dialog.open(ConfirmModalComponentComponent, {
          width: '400px',
          height: '250px',
          data: {
            title: 'Error',
            message:
              'El nombre de usuario ya está en uso. Por favor, elige otro.',
          },
        });
      }
    });

    // Si no existe, procede a guardar el nuevo usuario
    if (!exist) {
      const nuevoUsuario = this.isTrainer
        ? {
            avatar: this.myForm.get('avatar')?.value,
            name: username,
            password: this.myForm.get('trainer_pass')?.value,
            rol: this.myForm.get('trainer_rol')?.value,
            id_profesor: this.profesor?.id || null,
          }
        : {
            nombre: this.myForm.get('trainer_name')?.value,
            apellidos: this.myForm.get('trainer_lastName')?.value,
            usuario: this.myForm.get('usuario')?.value,
            password: this.myForm.get('trainer_pass')?.value,
            rol: this.myForm.get('trainer_rol')?.value,
            id_profesor: this.profesor?.id || null,
          };

      this.trainersService.postTrainer(nuevoUsuario).subscribe(
        (response) => {
          const stringMessage = this.isTrainer ? 'entrenador' : 'profesor';
          const data = {
            title: '¡Correcto!',
            message: `El ${stringMessage} se ha añadido correctamente.`,
          };
          this.dialog
            .open(ConfirmModalComponentComponent, {
              width: '400px',
              height: '250px',
              data: data,
            })
            .afterClosed()
            .subscribe(() => {
              this.dialogRef.close(nuevoUsuario);
            });
        },
        (error) => {
          console.error('Error al agregar el entrenador:', error);
        }
      );
    }
  }

  close() {
    this.getDataProfesor(this.nameProfesor);
    this.dialogRef.close();
  }
}

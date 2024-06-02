import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { ErrorLoginModalComponentComponent } from '../../../segments/error-login-modal-component/error-login-modal-component.component';
import { TrainerService } from '../../services/trainers/trainer.service';
import { ConfirmModalComponentComponent } from '../../../segments/confirm-modal-component/confirm-modal-component.component';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, MatDialogModule],
  providers: [TrainerService],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss',
})
export class NewUserComponent implements OnInit {
  myForm!: FormGroup;
  errorLogin: string = 'Nombre de entrenador o contraseña incorrectos.';
  trainers: any[] = [];
  error: boolean = false;
  user: string = '';
  pass: string = '';

  adminName = 'admin';
  adminPassword = 'admin';

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private dialog: MatDialog,
    private trainersService: TrainerService
  ) {}

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      trainer_name: ['', Validators.required],
      password: ['', Validators.required],
      rol: [''],
    });
  }

  onSubmit() {
    let user: string;
    let pass: string;
    let rol: string;
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      user = this.myForm.value.trainer_name;
      pass = this.myForm.value.password;
      rol = this.myForm.value.rol;

      console.log(formData);
      this.guardarEntrenador(user, pass, rol);
      // Aquí puedes manejar los datos del formulario como necesites
    }
    if (this.error) {
      this.openModal();
    }
  }

  openModal() {
    const data = {
      title: '¡Error de acceso!',
      message: this.errorLogin,
    };

    this.dialog.open(ErrorLoginModalComponentComponent, {
      width: '400px',
      height: '300px',
      data: data,
    });
  }

  guardarEntrenador(nuevoAlumnoNombre: any, nuevaPass: any, rol: string) {
    this.trainersService
      .postNewUser(nuevoAlumnoNombre, nuevaPass, rol)
      .subscribe(
        (response) => {
          const data = {
            title: '¡Correcto!',
            message: 'El entrenador se ha añadido correctamente.',
          };
          const dialogRef = this.dialog.open(ConfirmModalComponentComponent, {
            width: '400px', // Ancho de la ventana modal
            height: '300px', // Alto de la ventana modal
            data: data,
          });
          // Puedes realizar acciones después de que se cierre la modal si lo deseas
          dialogRef.afterClosed().subscribe((result) => {
            console.log('La modal se ha cerrado');
            window.location.reload();
          });
        },
        (error) => {
          console.error('Error al agregar el entrenador:', error);
        }
      );
  }
}

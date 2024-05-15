import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TrainerService } from '../services/trainerService.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ErrorLoginModalComponentComponent } from '../error-login-modal-component/error-login-modal-component.component';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, MatDialogModule],
  providers: [TrainerService],
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.scss',
})
export class LoginScreenComponent implements OnInit {
  myForm!: FormGroup;

  /** INICIO DE SESIÓN ADMINISTRADOR */
  adminName = 'admin';
  adminPassword = 'admin';
  trainers: any[] = [];
  privateData: any;
  modalAbierta = false;

  user: string = '';
  pass: string = '';

  errorLogin: string = 'Nombre de entrenador o contraseña incorrectos.';

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private trainerService: TrainerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    /** Valicación de datos para el formulario */
    this.myForm = this.formBuilder.group({
      trainer_name: ['', Validators.required],
      password: ['', [Validators.required, Validators.email]],
    });

    this.getTrainers();
  }

  /**
   * Función para obtener los datos de los entrenadores registrados
   */
  getTrainers() {
    this.trainerService.getTrainers().subscribe((data: any) => {
      this.trainers = data.trainer_list;
    });
  }

  /**
   * Función para abrir una ventana modal con mensaje de error
   * Para informar al usuario.
   */
  openModal() {
    if (!this.modalAbierta) {
      const data = {
        title: '¡Error de acceso!',
        message: this.errorLogin,
      };

      this.dialog.open(ErrorLoginModalComponentComponent, {
        width: '400px',
        height: '300px',
        data: data,
      });

      this.modalAbierta = true;
    }
  }

  /**
   * Función para el inicio de sesión
   *
   */
  startSession() {
    this.user = this.myForm.value.trainer_name;
    this.pass = this.myForm.value.password;
    console.log('entrenadores: ', this.trainers);

    /** Si los datos de inicio de sesión son de administrador
     * esto nos envía a una ventana Admin.
     * Si no es el caso, enviamos al usuario a la ventana principal.
     *
     *
     */
    if (this.user == this.adminName && this.pass == this.adminPassword) {
      this.route.navigate(['/admin', this.myForm.value]);
    } else {
      for (const trainer of this.trainers) {
        if (trainer.name === this.user && trainer.password === this.pass) {
          this.route.navigate(['/home', this.myForm.value]);
        } else {
          this.openModal();
        }
      }
    }
  }
}

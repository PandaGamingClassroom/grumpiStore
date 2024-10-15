import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ErrorLoginModalComponentComponent } from '../../segments/error-login-modal-component/error-login-modal-component.component';
import { TrainerService } from '../services/trainers/trainer.service';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, MatDialogModule],
  providers: [TrainerService],
  templateUrl: './login-screen.component.html',
  styleUrls: [
    './login-screen.component.scss',
    // Cambié 'styleUrl' a 'styleUrls' por typo
  ],
})
export class LoginScreenComponent implements OnInit {
  myForm!: FormGroup;
  adminName: string = '';
  adminPassword: string = '';
  trainers: any[] = [];
  profesors: any;
  error: boolean = false;
  user: string = '';
  pass: string = '';
  adminUser = 'administrador';
  profesor = 'profesor';
  errorLogin: string = 'Nombre de entrenador o contraseña incorrectos.';

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private trainerService: TrainerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      trainer_name: ['', Validators.required],
      password: ['', Validators.required],
      check: [false],
    });

    this.getTrainers();
    this.getProfesores();

    // Recuperar datos si "Recuérdame" estaba marcado
    const savedTrainerName = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    const rememberMe = localStorage.getItem('remember_me') === 'true';

    if (rememberMe && savedTrainerName) {
      this.myForm.patchValue({
        trainer_name: savedTrainerName,
        password: savedPassword,
        check: rememberMe,
      });
    }
  }

  getTrainers() {
    this.trainerService.getTrainers().subscribe((data: any) => {
      this.trainers = data.trainer_list;
    });
  }

  getProfesores() {
    this.trainerService.getProfesores().subscribe((data: any) => {
      this.profesors = data.profesoresList;
    });
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

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  onSubmit() {
    this.user = this.myForm.value.trainer_name;
    this.pass = this.myForm.value.password;
    const rememberMe = this.myForm.value.check;

    // Comprobar profesores
    for (const profe of this.profesors) {
      if (profe.usuario === this.user && profe.password === this.pass) {
        this.error = false;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', this.user);
        localStorage.setItem('nameUser', profe.nombre);
        localStorage.setItem('lastNameUser', profe.apellidos);
        localStorage.setItem('id_profesor', profe.id);

        if (profe.nombre === 'Pablo' && profe.apellidos === 'Moreno Ortega') {
          localStorage.setItem('isAdminUser', this.adminUser);
        } else {
          localStorage.setItem('isAdminUser', this.profesor);
        }

        // Guardar la contraseña si el checkbox está marcado
        if (rememberMe) {
          localStorage.setItem('password', this.pass);
          localStorage.setItem('remember_me', 'true');
        } else {
          localStorage.removeItem('password');
          localStorage.removeItem('remember_me');
        }

        // Actualizar última conexión y número de conexiones para el profesor
        const updateData = {
          nombre: profe.nombre,
          last_conection: new Date().toISOString(),
          connection_count: (profe.connection_count || 0) + 1,
        };
        this.trainerService
          .updateProfessorConnection(profe.id, updateData)
          .subscribe({
            next: () =>
              console.log(
                'Última conexión y contador de profesor actualizados.'
              ),
            error: (error) =>
              console.error('Error al actualizar datos del profesor:', error),
          });

        this.route.navigate(['/admin']);
        return;
      } else {
        this.error = true;
      }
    }

    // Comprobar entrenadores
    for (const trainer of this.trainers) {
      if (trainer.name === this.user && trainer.password === this.pass) {
        this.error = false;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', this.user);
        localStorage.setItem('id_trainer', trainer.id);

        if (rememberMe) {
          localStorage.setItem('password', this.pass);
          localStorage.setItem('remember_me', 'true');
        } else {
          localStorage.removeItem('password');
          localStorage.removeItem('remember_me');
        }

        // Actualizar última conexión y número de conexiones para el entrenador
        const updateData = {
          name: this.user,
          last_conection: new Date().toISOString(),
          connection_count: (trainer.connection_count || 0) + 1, // Incrementa el contador de conexiones
        };
        this.trainerService
          .updateTrainerConnection(trainer.id, updateData)
          .subscribe({
            next: () =>
              console.log(
                'Última conexión y contador de entrenador actualizados.'
              ),
            error: (error) =>
              console.error('Error al actualizar datos del entrenador:', error),
          });

        this.route.navigate(['/home']);
        return;
      } else {
        this.error = true;
      }
    }

    // Mostrar mensaje de error si no se encontraron coincidencias
    if (this.error) {
      this.openModal();
    }
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.route.navigate(['/login']);
  }
}

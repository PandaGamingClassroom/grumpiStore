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
  styleUrl: './login-screen.component.scss',
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
    });

    this.getTrainers();
    this.getProfesores();
  }

  /**
   * Función para obtener los datos de los entrenadores
   */
  getTrainers() {
    this.trainerService.getTrainers().subscribe((data: any) => {
      this.trainers = data.trainer_list;
    });
  }

  /**
   * Función para obtener los datos de los profesores
   */
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

  onSubmit() {
    this.user = this.myForm.value.trainer_name;
    this.pass = this.myForm.value.password;

    for (const profe of this.profesors) {
      if (profe.usuario === this.user && profe.password == this.pass) {
        this.error = false;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', this.user);
        localStorage.setItem('nameUser', profe.nombre);
        localStorage.setItem('lastNameUser', profe.apelidos);
        this.route.navigate(['/admin', this.myForm.value]);
        return;
      }
    }

    for (const trainer of this.trainers) {
      if (trainer.name === this.user && trainer.password === this.pass) {
        this.error = false;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', this.user);
        this.route.navigate(['/home', this.myForm.value]);
        return;
      }
    }

    if (this.error) {
      this.openModal();
    }
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    this.route.navigate(['/login']);
  }
}

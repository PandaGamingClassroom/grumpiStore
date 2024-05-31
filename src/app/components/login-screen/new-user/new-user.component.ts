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

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, MatDialogModule],
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
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      trainer_name: ['', Validators.required],
      password: ['', Validators.required],
      rol: [''],
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      console.log(formData);
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
}

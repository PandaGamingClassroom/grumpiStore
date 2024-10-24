import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../../services/trainers/trainer.service';
import { EditProfesorComponent } from '../edit-profesor/edit-profesor.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile-profesor',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  providers: [TrainerService],
  templateUrl: './profile-profesor.component.html',
  styleUrls: ['./profile-profesor.component.scss'],
})
export class ProfileComponent implements OnInit {
  myForm: FormGroup;
  profesor: any;
  username: any;
  nameProfesor: any;
  lastNameProfesor: any;
  profesors: any[] = [];
  selectedFile: File | null = null;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private trainersService: TrainerService,
    private dialog: MatDialog
  ) {
    this.myForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      password: ['', Validators.required],
      usuario: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.nameProfesor = localStorage.getItem('nameUser');
    this.getDadataProfesor(this.nameProfesor);
  }

  validateForm(profesor: any) {
    this.myForm.patchValue({
      usuario: profesor.usuario,
      nombre: profesor.nombre,
      apellidos: profesor.apellidos,
      password: profesor.password,
    });
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  getDadataProfesor(name: string) {
    this.trainersService.getProfesorByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message);
        } else {
          console.log('Perfil profesor: ', data);
          this.profesor = data.data;
          this.lastNameProfesor = data.data.apellidos;
          this.validateForm(this.profesor);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  openEditPage(trainer: any) {
    const dialogRef = this.dialog.open(EditProfesorComponent, {
      width: '400px',
      height: '400px',
      data: trainer,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllProfesors();
    });
  }

  getAllProfesors() {
    this.trainersService.getProfesores().subscribe(
      (data: any) => {
        console.log('Listado de profesores: ', data);
        this.profesors = data.profesoresList;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  uploadImage() {
    if (this.selectedFile) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.trainersService.uploadProfileImage(formData).subscribe(
        (response) => {
          this.profesor.img_profile = response.imageUrl;

          const updatedData = {
            img_profile: this.profesor.img_profile,
          };
          this.trainersService
            .updateIMGProfileProfessor(this.profesor.id, updatedData)
            .subscribe(
              () => {
                console.log('Perfil actualizado correctamente');
                this.isLoading = false;
              },
              (error) => {
                console.error('Error actualizando el perfil:', error);
                this.isLoading = false;
              }
            );
        },
        (error) => {
          console.error('Error subiendo la imagen:', error);
          this.isLoading = false;
        }
      );
    } else {
      console.error('No se ha seleccionado ningún archivo');
    }
  }
}

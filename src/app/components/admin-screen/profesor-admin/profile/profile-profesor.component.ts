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

@Component({
  selector: 'app-profile-profesor',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
  ],
  providers: [TrainerService],
  templateUrl: './profile-profesor.component.html',
  styleUrl: './profile-profesor.component.scss',
})
export class ProfileComponent implements OnInit {
  myForm: FormGroup;
  profesor: any;
  username: any;
  nameProfesor: any;
  lastNameProfesor: any;
  profesors: any[] = [];
  selectedFile: File | null = null;

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

  /**
   * Función para abrir una ventana emergente en la cual se va a poder
   * editar la información del entrenador seleccionado.
   *
   * @param trainer Recibe el entrenador seleccionado.
   */
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

  /**
   * Función para obtener el listado completo de profesores
   * que están dados de alta.
   */
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
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      const updatedData = {
        img_profile: this.selectedFile,
      };

      this.trainersService.uploadProfileImage(formData).subscribe(
        (response) => {
          this.profesor.img_profile = response.imageUrl; // Guarda la URL de Cloudinary

          // Llama a la función que actualiza los datos del profesor
          this.trainersService
            .updateAllDataProfessor(this.profesor.name, updatedData)
            .subscribe(
              () => {
                console.log('Perfil actualizado correctamente');
              },
              (error) => {
                console.error('Error actualizando el perfil:', error);
              }
            );
        },
        (error) => {
          console.error('Error subiendo la imagen:', error);
        }
      );
    } else {
      console.error('No se ha seleccionado ningún archivo');
    }
  }
}

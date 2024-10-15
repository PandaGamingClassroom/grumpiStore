import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TrainerService } from '../../../../services/trainers/trainer.service';
import { ConfirmModalComponentComponent } from '../../../../../segments/confirm-modal-component/confirm-modal-component.component';
import { ErrorLoginModalComponentComponent } from '../../../../../segments/error-login-modal-component/error-login-modal-component.component';

@Component({
  selector: 'app-blog-edit',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule, CommonModule],
  providers: [TrainerService],
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.scss'],
})
export class BlogEditComponent implements OnInit {
  profesor: any;
  postForm: FormGroup;
  isTwoImages: boolean = false;
  imageCount: string = 'una';
  selectedFiles: File[] = [];
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private trainersService: TrainerService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<BlogEditComponent>
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      imageCount: ['una'],
      backgroundImage: [null],
      useBackgroundImage: [false],
    });
  }

  ngOnInit(): void {
    this.profesor = localStorage.getItem('id_profesor');
    this.postForm.patchValue({
      title: this.data.title,
      content: this.data.content,
    });
  }

  /**
   * Función para evitar que se interactue con la imagen y así no se pueden descargar
   * @param event
   */
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  /**
   * Función para editar el post seleccionado.
   *
   * @param postId Recibe el id del post seleccionado.
   */
  editarPost(postId: number) {
    this.isLoading = true;
    if (this.postForm.valid) {
      const postFormData = new FormData();
      postFormData.append('title', this.postForm.get('title')?.value);
      postFormData.append('content', this.postForm.get('content')?.value);
      postFormData.append('order', this.postForm.get('order')?.value || '');
      postFormData.append('id_profesor', this.profesor || null);

      // Adjuntar las imágenes seleccionadas (si las hay)
      if (this.selectedFiles.length > 0) {
        this.selectedFiles.forEach((file) => {
          postFormData.append('images', file);
        });
      }

      // Adjuntar la imagen de fondo si el checkbox está marcado
      if (this.postForm.get('useBackgroundImage')?.value) {
        const backgroundImage = this.postForm.get('backgroundImage')?.value;
        if (backgroundImage) {
          postFormData.append('backgroundImage', backgroundImage);
        }
      }

      // Llamar al servicio para enviar los datos al backend
      this.trainersService.editPost(postId, postFormData).subscribe(
        (response) => {
          const data = {
            title: '¡Correcto!',
            message: `El post se ha editado correctamente.`,
          };
          this.openConfirmModal(data);
          console.log('Post editado correctamente!', response);
          this.isLoading = false;
          this.postForm.reset();
          this.selectedFiles = [];
        },
        (error) => {
          const data = {
            title: '¡Error!',
            message: `hemos tenido un problema editando el post.`,
          };
          this.openErrorModal(data);
          console.error('Error editando el post', error);
          this.isLoading = false;
        }
      );
    }
  }

  /**
   * Función para abrir una ventana modal de confirmación.
   * @param data Recibe el título y el mensaje de confirmación.
   */
  openConfirmModal(data: any) {
    this.dialog
      .open(ConfirmModalComponentComponent, {
        width: '400px',
        height: '250px',
        data: data,
      })
      .afterClosed()
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  /**
   * Función para abrir una ventana modal de error
   * @param data Recibe el título y el mensaje del error.
   */
  openErrorModal(data: any) {
    const dialogRef = this.dialog.open(ErrorLoginModalComponentComponent, {
      width: '400px',
      height: '300px',
      data: data,
    });
    dialogRef.afterClosed().subscribe();
  }

  onImageCountChange(event: any) {
    this.isTwoImages = event.target.value === 'dos';
    this.selectedFiles = [];
  }

  onFileSelected(event: any, index: number) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFiles[index] = file;
    }
  }

  onBackgroundImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.postForm.patchValue({ backgroundImage: file });
    }
  }

  close() {
    this.dialogRef.close();
  }
}

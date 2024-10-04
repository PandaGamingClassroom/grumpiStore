import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel
import { TrainerService } from '../../../services/trainers/trainer.service';

@Component({
  selector: 'app-blog-screen',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule, CommonModule],
  providers: [TrainerService],
  templateUrl: './blog-screen.component.html',
  styleUrls: ['./blog-screen.component.scss'],
})
export class BlogScreenComponent {
  postForm: FormGroup;
  selectedFiles: File[] = [];
  isTwoImages: boolean = false;
  imageCount: string = 'una';

  constructor(private fb: FormBuilder, private http: HttpClient, private trainersService: TrainerService) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      imageCount: ['una'] // Control para la cantidad de imágenes
    });
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

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  onSubmit() {
    if (this.postForm.valid) {
      const postFormData = new FormData();
      postFormData.append('title', this.postForm.get('title')?.value);
      postFormData.append('content', this.postForm.get('content')?.value);
      postFormData.append('order', this.postForm.get('order')?.value || '');

      // Si hay archivos seleccionados, adjuntar las imágenes
      if (this.selectedFiles.length > 0) {
        this.selectedFiles.forEach((file, index) => {
          postFormData.append('images', file); // Agrega las imágenes como 'images'
        });
      }

      // Enviar el formulario al backend
      this.trainersService.createPost(postFormData).subscribe(
        (postResponse) => {
          console.log('Post creado correctamente!', postResponse);
          this.postForm.reset();
          this.selectedFiles = [];
        },
        (error) => {
          console.error('Error creando el post', error);
        }
      );
    }
  }

}

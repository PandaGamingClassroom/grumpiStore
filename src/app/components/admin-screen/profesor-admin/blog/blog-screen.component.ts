import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel

@Component({
  selector: 'app-blog-screen',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule, CommonModule], // Asegúrate de importar FormsModule aquí
  templateUrl: './blog-screen.component.html',
  styleUrl: './blog-screen.component.scss',
})
export class BlogScreenComponent {
  postForm: FormGroup;
  selectedFiles: File[] = [];
  isTwoImages: boolean = false;
  imageCount: string = 'una'; 

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
      const formData = new FormData();
      formData.append('title', this.postForm.get('title')?.value);
      formData.append('content', this.postForm.get('content')?.value);

      if (this.selectedFiles[0]) {
        formData.append('image1', this.selectedFiles[0]);
      }

      if (this.isTwoImages && this.selectedFiles[1]) {
        formData.append('image2', this.selectedFiles[1]);
      }

      this.http.post('YOUR_API_ENDPOINT/posts', formData).subscribe(
        (response) => {
          console.log('Post creado correctamente!', response);
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

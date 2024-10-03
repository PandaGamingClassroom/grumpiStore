import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel

@Component({
  selector: 'app-blog-screen',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './blog-screen.component.html',
  styleUrls: ['./blog-screen.component.scss'],
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

      // Añadir las imágenes seleccionadas al formData
      this.selectedFiles.forEach((file, index) => {
        formData.append(`image${index + 1}`, file);
      });

      // Subir las imágenes a través del backend que subirá a Cloudinary
      this.http.post('http://localhost:3000/upload', formData).subscribe(
        (response: any) => {
          console.log('Imágenes subidas a Cloudinary:', response);

          // Guardar el post con las URLs de las imágenes devueltas
          const postFormData = new FormData();
          postFormData.append('title', this.postForm.get('title')?.value);
          postFormData.append('content', this.postForm.get('content')?.value);
          postFormData.append('imageUrls', JSON.stringify(response)); // Guardar las URLs

          this.http.post('YOUR_API_ENDPOINT/posts', postFormData).subscribe(
            (postResponse) => {
              console.log('Post creado correctamente!', postResponse);
              this.postForm.reset();
              this.selectedFiles = [];
            },
            (error) => {
              console.error('Error creando el post', error);
            }
          );
        },
        (error) => {
          console.error('Error subiendo las imágenes', error);
        }
      );
    }
  }
}

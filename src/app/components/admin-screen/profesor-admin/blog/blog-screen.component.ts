import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
export class BlogScreenComponent implements OnInit{
  postForm: FormGroup;
  selectedFiles: File[] = [];
  isTwoImages: boolean = false;
  imageCount: string = 'una';
  profesor: any;
  posts: any[] = [];
  isLoading = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private trainersService: TrainerService) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      imageCount: ['una']
    });
  }

  ngOnInit(): void {
    this.profesor = localStorage.getItem('id_profesor');
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

  crearPost() {
    this.isLoading = true;
    if (this.postForm.valid) {
      const postFormData = new FormData();
      postFormData.append('title', this.postForm.get('title')?.value);
      postFormData.append('content', this.postForm.get('content')?.value);
      postFormData.append('order', this.postForm.get('order')?.value || '');
      postFormData.append('id_profesor', this.profesor || null);

      // Si hay archivos seleccionados, adjuntar las imágenes
      if (this.selectedFiles.length > 0) {
        this.selectedFiles.forEach((file, index) => {
          postFormData.append('images', file);
        });
      }

      // Enviar el formulario al backend
      this.trainersService.createPost(postFormData).subscribe(
        (postResponse) => {
          console.log('Post creado correctamente!', postResponse);
          this.isLoading = false;
          this.postForm.reset();
          this.selectedFiles = [];
        },
        (error) => {
          console.error('Error creando el post', error);
          this.isLoading = false;
        }
      );
    }
  }

  obtenerPosts() {
    this.trainersService.obtenerPost(this.profesor).subscribe(
      (data) => {
        this.posts = data;
      },
      (error) => {
        console.error('Error al obtener los posts', error);
      }
    );
  }

}

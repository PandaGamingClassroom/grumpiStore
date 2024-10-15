import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel
import { TrainerService } from '../../../services/trainers/trainer.service';
import { MatDialog } from '@angular/material/dialog';
import { BlogDetailsComponent } from './blog-details/blog-details.component';

@Component({
  selector: 'app-blog-screen',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule, CommonModule],
  providers: [TrainerService],
  templateUrl: './blog-screen.component.html',
  styleUrls: ['./blog-screen.component.scss'],
})
export class BlogScreenComponent implements OnInit {
  postForm: FormGroup;
  selectedFiles: File[] = [];
  isTwoImages: boolean = false;
  imageCount: string = 'una';
  profesor: any;
  posts: any[] = [];
  isLoading: boolean = false;
  background: boolean = false;
  selectedPostId: number | null = null;

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private trainersService: TrainerService,
    private dialog: MatDialog
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      imageCount: ['una'],
      backgroundImage: [null],
      useBackgroundImage: [false]
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

      // Adjuntar la imagen de fondo solo si el checkbox está marcado
      if (this.postForm.get('useBackgroundImage')?.value) {
        const backgroundImage = this.postForm.get('backgroundImage')?.value;
        if (backgroundImage) {
          postFormData.append('backgroundImage', backgroundImage);
        }
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

  onBackgroundImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.postForm.patchValue({ backgroundImage: file });
    }
  }

  openDetailsPost(post: any) {
    const dialogRef = this.dialog.open(BlogDetailsComponent, {
      width: '700px',
      height: '600px',
      data: post,
    });
  }

  eliminarPost(postId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este post?')) {
      this.trainersService.eliminarPost(postId).subscribe(
        () => {
          console.log('Post eliminado correctamente');
          // Actualizar la lista de posts después de eliminar
          this.obtenerPosts();
        },
        (error) => {
          console.error('Error al eliminar el post', error);
        }
      );
    }
  }


}

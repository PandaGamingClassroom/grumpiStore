import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-screen',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './blog-screen.component.html',
  styleUrl: './blog-screen.component.scss',
})
export class BlogScreenComponent {
  postForm: FormGroup;
  selectedFile: File | null = null;
  isTwoImages: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const selectedType = event.target.value;
    if (file) {
      this.selectedFile = file;
    }
    if (selectedType === "dos") {
      this.isTwoImages = true;
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
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
        formData.append('image1', this.selectedFile);
        formData.append('image2', this.selectedFile);
      }

      this.http.post('YOUR_API_ENDPOINT/posts', formData).subscribe(
        (response) => {
          console.log('Post creado correctamente!', response);
          this.postForm.reset();
        },
        (error) => {
          console.error('Error creando el post', error);
        }
      );
    }
  }
}

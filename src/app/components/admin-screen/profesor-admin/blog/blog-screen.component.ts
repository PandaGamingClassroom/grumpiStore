import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-screen',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './blog-screen.component.html',
  styleUrl: './blog-screen.component.scss',
})
export class BlogScreenComponent {
  postForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
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
      }

      this.http.post('YOUR_API_ENDPOINT/posts', formData).subscribe(
        (response) => {
          console.log('Post created successfully!', response);
          this.postForm.reset();
        },
        (error) => {
          console.error('Error creating post', error);
        }
      );
    }
  }
}

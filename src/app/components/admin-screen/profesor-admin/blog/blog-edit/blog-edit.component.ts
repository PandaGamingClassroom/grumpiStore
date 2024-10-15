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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TrainerService } from '../../../../services/trainers/trainer.service';

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
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  editarPost() {}

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

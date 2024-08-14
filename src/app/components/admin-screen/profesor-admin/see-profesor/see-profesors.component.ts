import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-see-profesors',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './see-profesors.component.html',
  styleUrl: './see-profesors.component.scss',
})
export class SeeProfesorsComponent implements OnInit {
  myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SeeProfesorsComponent>
  ) {
    this.myForm = this.formBuilder.group({
      trainer_name: ['', Validators.required],
      trainer_pass: ['', Validators.required],
      usuario: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.myForm.patchValue({
      usuario: this.data.usuario,
      trainer_name: this.data.nombre,
      trainer_pass: this.data.password
    });
  }

  close() {
    this.dialogRef.close();
  }
}

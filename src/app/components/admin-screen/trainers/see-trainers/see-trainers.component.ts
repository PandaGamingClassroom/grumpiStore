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
  selector: 'app-see-trainers',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './see-trainers.component.html',
  styleUrl: './see-trainers.component.scss',
})
export class SeeTrainersComponent implements OnInit {
  myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SeeTrainersComponent>
  ) {
    this.myForm = this.formBuilder.group({
      trainer_name: ['', Validators.required],
      trainer_pass: ['', Validators.required],
      grumpidolar: [''],
      combatMark: [''],
    });
  }
  ngOnInit(): void {
    this.myForm.patchValue({
      trainer_name: this.data.name,
      trainer_pass: this.data.password,
      grumpidolar: this.data.grumpidolar || '', // Si no hay grumpidolar, se establece como cadena vacía
      combatMark: this.data.marca_combate,
    });
  }

  close() {
    this.dialogRef.close();
  }
}

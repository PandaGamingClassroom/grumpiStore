import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../../services/trainers/trainerService.service';

@Component({
  selector: 'app-trainers-edit',
  standalone: true,
  imports: [
    RouterLink,
    NavBarAdminComponent,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  providers: [TrainerService],
  templateUrl: './trainers-edit.component.html',
  styleUrl: './trainers-edit.component.scss',
})
export class TrainersEditComponent implements OnInit {
  user: string = '';
  pass: string = '';
  myForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TrainersEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.user = this.data.name;
    this.pass = this.data.password;

    this.myForm = this.formBuilder.group({
      trainer_name: ['Nombre por defecto', Validators.required],
    });
    this.myForm = this.formBuilder.group({
      trainer_pass: ['Contraseña por defecto', Validators.required],
    });
    console.log('data', this.data);
  }

  close() {
    this.dialogRef.close();
  }
}

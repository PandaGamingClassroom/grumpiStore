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
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../../services/trainers/trainer.service';

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
  styleUrls: ['./trainers-edit.component.scss'],
})
export class TrainersEditComponent implements OnInit {
  user: string = '';
  pass: string = '';
  grumpidolar: string = '';
  myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TrainersEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private trainersService: TrainerService
  ) {
    this.myForm = this.formBuilder.group({
      trainer_name: ['', Validators.required],
      trainer_pass: ['', Validators.required],
      grumpidolar: [''],
      combatMark: ['']
    });
  }

  ngOnInit() {
    // Rellenar el formulario con los datos recibidos
    this.myForm.patchValue({
      trainer_name: this.data.name,
      trainer_pass: this.data.password,
      grumpidolar: this.data.grumpidolar || '', // Si no hay grumpidolar, se establece como cadena vacía
      combatMark: this.data.marca_combate
    });

    console.log('data edit', this.data);
  }

  onSubmit() {
    if (this.myForm.valid) {
      const updatedData = {
        name: this.myForm.get('trainer_name')?.value,
        password: this.myForm.get('trainer_pass')?.value,
        grumpidolar: this.myForm.get('grumpidolar')?.value,
        combatMark: this.myForm.get('combatMark')?.value,
      };

      this.trainersService
        .updateTrainer(this.data.name, updatedData)
        .subscribe((response) => {
          console.log('Trainer updated', response);
          this.close();
        });
    }
  }

  close() {
    this.dialogRef.close();
  }
}

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
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../../services/trainers/trainer.service';
import { ConfirmModalComponentComponent } from '../../../../segments/confirm-modal-component/confirm-modal-component.component';

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
  templateUrl: './edit-profesor.component.html',
  styleUrls: ['./edit-profesor.component.scss'],
})
export class EditProfesorComponent implements OnInit {
  user: string = '';
  pass: string = '';
  grumpidolar: string = '';
  myForm: FormGroup;
  selectedMedals: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditProfesorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private trainersService: TrainerService,
    private dialog: MatDialog
  ) {
    this.myForm = this.formBuilder.group({
      profesorName: ['', Validators.required],
      profesorPass: ['', Validators.required],
      profesorUser: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.myForm.patchValue({
      profesorName: this.data.nombre,
      profesorPass: this.data.password,
      profesorUser: this.data.usuario,
    });

    console.log('data edit', this.data);
  }

  onSubmit() {
    if (this.myForm.valid) {
      const updatedData = {
        nombre: this.myForm.get('profesorName')?.value,
        password: this.myForm.get('profesorPass')?.value,
        usuario: this.myForm.get('profesorUser')?.value,
      };

      this.trainersService
        .updateTrainer(this.data.name, updatedData)
        .subscribe((response) => {
          console.log('Trainer updated', response);
          this.close();
          this.dialog.open(ConfirmModalComponentComponent, {
            width: '400px',
            height: '300px',
            data: {
              title: '¡Correcto!',
              message: 'El entrenador se ha editado correctamente.',
            },
          });
        });
    }
  }

  close() {
    this.dialogRef.close();
  }

  toggleMedalSelection(index: number) {
    const selectedIndex = this.selectedMedals.indexOf(index);
    if (selectedIndex > -1) {
      this.selectedMedals.splice(selectedIndex, 1);
    } else {
      this.selectedMedals.push(index);
    }
  }
}

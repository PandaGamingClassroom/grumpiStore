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
  templateUrl: './edit-complete-dataProfesor.component.html',
  styleUrls: ['./edit-complete-dataProfesor.component.scss'],
})
export class EditCompleteDataProfesorComponent implements OnInit {
  user: string = '';
  pass: string = '';
  grumpidolar: string = '';
  myForm: FormGroup;
  selectedMedals: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditCompleteDataProfesorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private trainersService: TrainerService,
    private dialog: MatDialog
  ) {
    this.myForm = this.formBuilder.group({
      professor_name: ['', Validators.required],
      password: ['', Validators.required],
      usuario: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.myForm.patchValue({
      usuario: this.data.usuario,
      professor_name: this.data.nombre,
      password: this.data.password,
    });

    console.log('data edit', this.data);
  }

  onSubmit() {
    const updatedData = {
      usuario: this.myForm.get('usuario')?.value,
      professor_name: this.myForm.get('professor_name')?.value,
      password: this.myForm.get('password')?.value,
    };
    this.trainersService
      .updateAllDataProfessor(this.data.nombre, updatedData)
      .subscribe((response) => {
        console.log('Profesor actualizado correctamente.', response);
        this.close();
        const dialogRef = this.dialog.open(ConfirmModalComponentComponent, {
          width: '400px',
          height: '300px',
          data: {
            title: '¡Correcto!',
            message: 'El profesor se ha editado correctamente.',
          },
        });
        dialogRef.afterClosed().subscribe(() => {
          window.location.reload();
        });
      });
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

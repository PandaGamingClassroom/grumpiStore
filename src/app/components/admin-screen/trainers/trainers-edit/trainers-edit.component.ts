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
import { EditObjetosModalComponent } from '../edit-objetos-modal/edit-objetos-modal.component';

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
  selectedMedals: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TrainersEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private trainersService: TrainerService,
    private dialog: MatDialog
  ) {
    this.myForm = this.formBuilder.group({
      trainer_name: ['', Validators.required],
      trainer_pass: ['', Validators.required],
      grumpidolar: [''],
      combatMark: [''],
    });
  }

  ngOnInit() {
    this.myForm.patchValue({
      trainer_name: this.data.name,
      trainer_pass: this.data.password,
      grumpidolar: this.data.grumpidolar || '',
      combatMark: this.data.marca_combate,
    });

    console.log('data edit', this.data);
  }

  onSubmit() {
    const updatedData = {
      name: this.myForm.get('trainer_name')?.value,
      password: this.myForm.get('trainer_pass')?.value,
      grumpidolar: this.myForm.get('grumpidolar')?.value,
      combatMark: this.myForm.get('combatMark')?.value,
      medalsToRemove: this.selectedMedals,
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

  /**
   * Función para abrir la ventana emergente con el inventario
   * del entrenador seleccionado.
   *
   */
  verInventario(): void {
    this.dialog.open(EditObjetosModalComponent, {
      width: '600px',
      height: '550px',
      panelClass: 'custom-modal',
      disableClose: true,
      autoFocus: true,
      data: this.data,
    }).afterClosed().subscribe(() => {
      this.dialogRef.close(this.data);
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

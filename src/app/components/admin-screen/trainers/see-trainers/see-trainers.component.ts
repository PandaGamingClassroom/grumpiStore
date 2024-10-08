import { CommonModule } from '@angular/common';
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
import { RouterLink } from '@angular/router';
import { VerObjetosModalComponent } from '../ver-objetos-modal/ver-objetos-modal.component';
import { TrainersEditComponent } from '../trainers-edit/trainers-edit.component';

@Component({
  selector: 'app-see-trainers',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
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
    public dialogRef: MatDialogRef<SeeTrainersComponent>,
    public dialog: MatDialog
  ) {
    this.myForm = this.formBuilder.group({
      trainer_name: ['', Validators.required],
      trainer_pass: ['', Validators.required],
      grumpidolar: [''],
      combatMark: [''],
      connection_count: [''],
      last_conection: [''],
    });
  }

  ngOnInit(): void {
    this.myForm.patchValue({
      trainer_name: this.data.name,
      trainer_pass: this.data.password,
      grumpidolar: this.data.grumpidolar || '',
      combatMark: this.data.marca_combate,
      connection_count: this.data.connection_count,
      last_conection: this.formatDate(this.data.last_conection),
    });
  }

  close() {
    this.dialogRef.close();
  }

  /**
   * Función para mostrar los objetos que tienen los entrenadores en la mochila
   */
  verInventario(): void {
    const dialogRef = this.dialog.open(VerObjetosModalComponent, {
      width: '600px',
      height: '550px',
      panelClass: 'custom-modal',
      disableClose: true,
      autoFocus: true,
      data: this.data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('La vista de los objetos se ha cerrado');
    });
  }

  /**
   *
   * Función para abrir la ventana de edición del entrenador.
   *
   * @param trainer Recibe los datos del entrenador seleccionado.
   */
  openEditPage(trainer: any) {
    this.dialog.open(TrainersEditComponent, {
      width: '700px',
      height: '600px',
      data: trainer,
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}

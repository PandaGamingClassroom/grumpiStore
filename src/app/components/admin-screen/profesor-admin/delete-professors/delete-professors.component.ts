import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../../services/trainers/trainer.service';
import { ConfirmModalComponentComponent } from '../../../../segments/confirm-modal-component/confirm-modal-component.component';

@Component({
  selector: 'app-delete-trainers',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    MatDialogModule,
  ],
  providers: [TrainerService],
  templateUrl: './delete-professors.component.html',
  styleUrls: ['./delete-professors.component.scss'], // Corregido
})
export class DeleteProfessorsComponent implements OnInit {
  professorName: string = '';
  professors: any[] = [];
  profesor: any;
  username: any;
  nameProfesor: any;
  lastNameProfesor: any;

  constructor(
    private trainersService: TrainerService,
    public dialogRef: MatDialogRef<DeleteProfessorsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.nameProfesor = localStorage.getItem('nameUser');
    this.getDataProfesor(this.nameProfesor); // Corregido
    this.professorName = this.data.nombre;
  }

  getDataProfesor(name: string) {
    // Corregido
    this.trainersService.getProfesorByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message); // Maneja el mensaje de "Profesor no encontrado"
        } else {
          this.profesor = data.data;
          this.lastNameProfesor = data.data.apellidos;
          this.getProfessors(data.data.id);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  deleteProfessor() {
    console.log('Profesor a eliminar: ', this.professorName);

    const data = {
      title: '¡Eliminando profesor!',
      message: 'El profesor se ha eliminado correctamente.',
    };

    if (!this.professorName) {
      console.error('No se encontró el profesor a eliminar');
      return;
    }

    this.trainersService.eliminarProfesor(this.professorName).subscribe(
      () => {
        this.getProfessors(this.profesor.id);
        this.dialog.open(ConfirmModalComponentComponent, {
          width: '400px',
          height: '300px',
          data: data,
        }).afterClosed().subscribe(() => {
          this.dialogRef.close(true);
        });
      },
      (error) => {
        console.error('Error al eliminar el registro:', error);
      }
    );
  }

  getProfessors(profesorId: number) {
    this.trainersService.getProfesor(profesorId).subscribe(
      (data) => {
        this.professors = data.data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  close() {
    this.dialogRef.close();
  }
}

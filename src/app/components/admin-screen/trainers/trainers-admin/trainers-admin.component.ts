import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { TrainersEditComponent } from '../trainers-edit/trainers-edit.component';
import { TrainerService } from '../../../services/trainers/trainer.service';
import { AddTrainersComponent } from '../add-trainers/add-trainers.component';
import { DeleteTrainersComponent } from '../delete-trainers/delete-trainers.component';
import { SeeTrainersComponent } from '../see-trainers/see-trainers.component';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { FooterComponent } from '../../../footer/footer.component';

@Component({
  selector: 'app-trainers-admin',
  standalone: true,
  imports: [
    RouterLink,
    NavBarAdminComponent,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    FooterComponent
  ],
  providers: [TrainerService],
  templateUrl: './trainers-admin.component.html',
  styleUrls: ['./trainers-admin.component.scss'],
})
export class TrainersAdminComponent implements OnInit {
  trainers: any[] = [];
  errorGetTrainers: string = 'No se han encontrado entrenadores';
  getError: boolean = false;
  trainerSelected: string = '';
  profesor: any;
  username: any;
  nameProfesor: any;
  lastNameProfesor: any;
  loading: boolean = true;

  constructor(
    private trainersService: TrainerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.nameProfesor = localStorage.getItem('nameUser');
    this.getDadataProfesor(this.nameProfesor);
  }

  /**
   * 
   * Función para obtener los datos del profesor.
   * 
   * @param name Recibe el nombre del profesor
   */
  getDadataProfesor(name: string) {
    this.trainersService.getProfesorByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message);
        } else {
          this.profesor = data.data;
          this.lastNameProfesor = data.data.apellidos;
          this.getEntrenadores(data.data.id);
        }
      },
      (error) => {
        console.error('Error:', error);
        this.loading = false; 
      }
    );
  }

  /**
   * 
   * Función para obtener la lista de entrenadores
   * del profesor que ha iniciado sesión.
   * 
   * @param profesorId Recibe el id del profesor.
   */
  getEntrenadores(profesorId: number) {
    this.trainersService.getEntrenadoresByProfesorId(profesorId).subscribe(
      (data) => {
        this.trainers = data.data;
        this.loading = false; 
      },
      (error) => {
        console.error('Error:', error);
        this.loading = false; 
      }
    );
  }

  selectTrainer(trainer: string) {
    this.trainerSelected = trainer;
  }

  /**
   * Función para abrir una ventana emergente en la cual se va a poder
   * editar la información del entrenador seleccionado.
   *
   * @param trainer Recibe el entrenador seleccionado.
   */
  openEditPage(trainer: any) {
    const dialogRef = this.dialog.open(TrainersEditComponent, {
      width: '700px',
      height: '600px',
      data: trainer,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getEntrenadores(this.profesor.id); // Actualiza la lista de entrenadores después de cerrar el modal
    });
  }

  /**
   * Función para abrir la ventana modal en la que se va a mostrar la información
   * de un entrenador seleccionado.ç
   *
   * En esta ventana solo se podrá visualizar la información
   * No se va a poder editar nada.
   *
   * @param trainer Recibe el entrenador seleccionado.
   */
  openSeeTrainers(trainer: any) {
    const dialogRef = this.dialog.open(SeeTrainersComponent, {
      width: '700px',
      height: '600px',
      data: trainer,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getEntrenadores(this.profesor.id); // Actualiza la lista de entrenadores después de cerrar el modal
    });
  }

  /**
   * Función para abrir una ventana emergente en la cual
   * se puede añadir un entrenador nuevo a la lista de entrenadores del profesor.
   */
  openAddTrainerModal(): void {
    const dialogRef = this.dialog.open(AddTrainersComponent, {
      width: '700px',
      height: '600px',
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Nuevo entrenador añadido:', result);
        this.getEntrenadores(this.profesor.id);
      }
    });
  }
  

  /**
   * Función para abrir una ventana emergente en la cual se elimina al entrenador seleccionado.
   *
   * @param trainer Recibe el entrenador que se ha seleccionado
   */
  openDeleteTrainerModal(trainer: any) {
    const dialogRef = this.dialog.open(DeleteTrainersComponent, {
      width: '400px',
      height: '300px',
      data: trainer,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Entrenador eliminado:', trainer);
        this.getEntrenadores(this.profesor.id);
      }
    });
  }
  
}

import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { TrainerService } from '../../../services/trainers/trainer.service';
import { TrainersEditComponent } from '../trainers-edit/trainers-edit.component';
import { AddTrainersComponent } from '../add-trainers/add-trainers.component';
import { DeleteTrainersComponent } from '../delete-trainers/delete-trainers.component';
import { SeeTrainersComponent } from '../see-trainers/see-trainers.component';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { FooterComponent } from '../../../footer/footer.component';

@Component({
  selector: 'app-trainers-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    DragDropModule,
    NavBarAdminComponent,
    FooterComponent,
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

  onTrainersReordered(event: CdkDragDrop<any[]>): void {
    // Asegúrate de que event.item.data esté definido
    console.log('Evento: ', event.item);

    const movedItem = event.item.data;
    if (!movedItem || !movedItem.id) {
      console.error(
        'Error: El elemento movido no tiene un ID válido',
        movedItem
      );
      return;
    }

    // Encuentra el índice del elemento movido
    const prevIndex = this.trainers.findIndex(
      (trainer) => trainer.id === movedItem.id
    );

    // Verifica que el índice sea válido
    if (prevIndex === -1) {
      console.error('Error: El índice anterior no es válido', movedItem);
      return;
    }

    // Realiza el reordenamiento
    this.trainers.splice(prevIndex, 1);
    this.trainers.splice(event.currentIndex, 0, movedItem);

    console.log('Entrenadores reordenados:', this.trainers);
    // Puedes enviar el nuevo orden al backend aquí si es necesario
  }

  openEditPage(trainer: any) {
    const dialogRef = this.dialog.open(TrainersEditComponent, {
      width: '700px',
      height: '600px',
      data: trainer,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getEntrenadores(this.profesor.id);
    });
  }

  openSeeTrainers(trainer: any) {
    const dialogRef = this.dialog.open(SeeTrainersComponent, {
      width: '700px',
      height: '600px',
      data: trainer,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getEntrenadores(this.profesor.id);
    });
  }

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

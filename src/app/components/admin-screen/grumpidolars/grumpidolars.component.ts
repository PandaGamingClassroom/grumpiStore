import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TrainerService } from '../../services/trainers/trainer.service';
import { AdminUserService } from '../../services/adminUser/adminUser.service';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-grumpidolars',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    FooterComponent
  ],
  providers: [TrainerService, AdminUserService],
  templateUrl: './grumpidolars.component.html',
  styleUrls: ['./grumpidolars.component.scss'],
})
export class GrumpidolarsComponent implements OnInit {
  trainerList: any[] = [];
  myForm: FormGroup;
  grumpidolaresPorEntrenador: { [key: string]: number } = {};
  nameProfesor: any;
  username: any;
  lastNameProfesor: any;
  profesor: any;
  isAdminUser: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private trainersService: TrainerService,
    private adminUserService: AdminUserService
  ) {
    this.myForm = this.formBuilder.group({
      grumpidolar: [''],
    });
    this.trainerList.forEach((trainer) => {
      this.grumpidolaresPorEntrenador[trainer.name] = 0;
    });
  }

  ngOnInit(): void {
    this.adminUserService.adminUser$.subscribe((isAdmin) => {
      this.isAdminUser = isAdmin;
    });
    if (typeof window !== 'undefined') {
      // Verifica si `window` está definido
      this.username = localStorage.getItem('username');
      this.nameProfesor = localStorage.getItem('nameUser');
      this.getDadataProfesor(this.nameProfesor);
    }
  }

  getTrainers() {
    this.trainersService.getTrainers().subscribe(
      (response: any) => {
        if (Array.isArray(response.trainer_list)) {
          this.trainerList = response.trainer_list;
        } else {
          console.error(
            'Error: los datos de entrenadores no son un array:',
            response.trainer_list
          );
        }
      },
      (error) => {
        console.error('Error obteniendo los entrenadores:', error);
      }
    );
  }

  getDadataProfesor(name: string) {
    this.trainersService.getProfesorByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message); // Maneja el mensaje de "Profesor no encontrado"
        } else {
          this.profesor = data;
          console.log('Profesor: ', this.profesor);
          this.lastNameProfesor = data.data.apellidos;
          this.getEntrenadores(data.data.id);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getEntrenadores(profesorId: number) {
    this.trainersService.getEntrenadoresByProfesorId(profesorId).subscribe(
      (data) => {
        this.trainerList = data.data;
        console.log('Entrenadores del profesor: ', this.trainerList);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  assignGrumpidolares(trainerName: string, grumpidolares: number): void {
    const grumpidolaresNumber = Number(grumpidolares);
    if (isNaN(grumpidolaresNumber) || grumpidolaresNumber <= 0) {
      console.error('Grumpidólares debe ser un número positivo.');
      return;
    }

    this.trainersService
      .assignGrumpidolaresToTrainer(trainerName, grumpidolaresNumber)
      .subscribe(
        (response) => {
          this.getDadataProfesor(this.nameProfesor);
          this.grumpidolaresPorEntrenador[trainerName] = 0; // Limpiar el input
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }
}

import { Component, OnInit } from '@angular/core';
import { GrumpiService } from '../../../services/grumpi/grumpi.service';
import { TrainerService } from '../../../services/trainers/trainer.service';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Energies, energias } from '../../../../models/energies';

@Component({
  selector: 'app-energies-management',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  providers: [TrainerService, GrumpiService],
  templateUrl: './energies-management.component.html',
  styleUrl: './energies-management.component.scss',
})
export class EnergiesManagementComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  trainerList: any[] = [];
  energiesImages: string[] = [];
  selectedEnergieName: string | null = null;
  selectedTrainerName: string | null = null;
  selectedFile: File | null = null;
  energy_list: Energies[] = energias;
  selectedEnergie: any;

  constructor(
    private trainersService: TrainerService,
    private grumpiService: GrumpiService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      imagen: [''],
    });
    this.getTrainers();
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

  onSubmit(event: Event) {
    event.preventDefault();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }
  assignEnergies(): void {
    if (this.selectedTrainerName && this.selectedEnergie) {
      this.trainersService
        .assignEnergie(this.selectedTrainerName, this.selectedEnergie)
        .subscribe(
          (response) => {
            console.log(
              'Energía asignada correctamente al entrenador:',
              response
            );
            // Aquí puedes manejar la respuesta como desees
          },
          (error) => {
            console.error('Error al asignar la energía al entrenador:', error);
            // Aquí puedes manejar el error como desees
          }
        );
    } else {
      console.error('No se ha seleccionado ningún entrenador o energía.');
      // Aquí puedes manejar el caso donde no se haya seleccionado ningún entrenador o energía
    }
  }
}

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../services/trainers/trainer.service';
import { GrumpiService } from '../../services/grumpi/grumpi.service';
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';

@Component({
  selector: 'app-energies',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    NavBarAdminComponent,
  ],
  providers: [TrainerService, GrumpiService],
  templateUrl: './energies.component.html',
  styleUrl: './energies.component.scss',
})
export class EnergiesComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  trainerList: any[] = [];
  energiesImages: string[] = [];
  searchTerm: string = '';
  selectedEnergieName: string | null = null;
  selectedTrainerName: string | null = null;
  selectedFile: File | null = null;

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

  loadImageUrls() {
    this.grumpiService.getImageEnergies().subscribe(
      (response) => {
        this.energiesImages = response.imageUrls;
      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
  }

  get filteredMedalsImages(): string[] {
    return this.energiesImages.filter((imageUrl) =>
      imageUrl.toLowerCase().includes(this.searchTerm.toLowerCase())
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
    if (
      this.selectedTrainerName !== null &&
      this.selectedEnergieName !== null
    ) {
      // Obtén el nombre del entrenador seleccionado
      const trainerName = this.selectedTrainerName;

      // Obtén el nombre de la criatura seleccionada
      const energieName = this.selectedEnergieName;

      // Llama al servicio para asignar la criatura al entrenador por su nombre
      this.trainersService
        .assignEnergiesToTrainer(trainerName, energieName)
        .subscribe(
          (response) => {
            console.log('Energía asignada con éxito:', response);
            alert('Energía asignada con éxito');
          },
          (error) => {
            console.error('Error asignando la energía:', error);
            alert('Error asignando la energía');
          }
        );
    } else {
      alert('Por favor, selecciona un entrenador y una energía.');
    }
  }
}

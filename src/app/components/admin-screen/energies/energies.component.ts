import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../services/trainers/trainer.service';
import { GrumpiService } from '../../services/grumpi/grumpi.service';
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { Energies, energias } from '../../../models/energies';
import { SelectTrainerComponent } from '../trainers/select-trainer/select-trainer.component';

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
  selectedEnergieName: string | null = null;
  selectedTrainerName: string | null = null;
  selectedFile: File | null = null;
  energy_list: Energies[] = energias;
  selectedEnergie: any;

  constructor(
    private trainersService: TrainerService,
    private grumpiService: GrumpiService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
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

  /**
   * Función para abrir la ventana emergente que muestra la lista de entrenadores disponibles
   * Al seleccionar el entrenador en dicha ventana, recibimos aquí el nombre de ese entrenador
   * Y con esos datos asignamos el objeto seleccionado.
   */
  openTrainers() {
    const dialogRef = this.dialog.open(SelectTrainerComponent, {
      width: '400px',
      height: '300px',
    });

    dialogRef.afterClosed().subscribe((selectedTrainerName: string | null) => {
      if (selectedTrainerName) {
        this.selectedTrainerName = selectedTrainerName;
        console.log('Seleccion de entrenador: ', selectedTrainerName);
        this.assignEnergies();
      }
    });
  }
}

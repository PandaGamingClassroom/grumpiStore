import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../services/trainers/trainer.service';
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { Energies, energias } from '../../../models/energies';
import { SelectTrainerComponent } from '../trainers/select-trainer/select-trainer.component';
import { AdminUserService } from '../../services/adminUser/adminUser.service';
import { FooterComponent } from '../../footer/footer.component';
import { ConfirmModalComponentComponent } from '../../../segments/confirm-modal-component/confirm-modal-component.component';

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
    FooterComponent,
  ],
  providers: [TrainerService, AdminUserService],
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
  isAdminUser: boolean = false;
  adminUser: any;
  confirmMessage: string = 'La energía ha sido asignada con éxito al entrenador.';

  constructor(
    private trainersService: TrainerService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private adminUserService: AdminUserService
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.adminUser = localStorage.getItem('isAdminUser');
      if (this.adminUser === 'administrador') {
        this.isAdminUser = true;
      } else {
        this.isAdminUser = false;
      }
    }
    this.myForm = this.formBuilder.group({
      imagen: [''],
    });
    this.getTrainers();
  }

  /**
   *
   */
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

  /**
   *
   * @param event
   */
  onSubmit(event: Event) {
    event.preventDefault();
  }

  /**
   *
   * @param event
   */
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }

  /**
   *
   */
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
   * Función para abrir la ventana modal de confirmación de la acción.
   *
   * @param data_to_receive Recibe en este caso el nombre del entrenador seleccionado.
   */
  modalConfirm(data_to_receive: any){
    const data = {
      title: '¡Energía asignada con éxito!',
      message: `La energía ha sido asignada correctamente al entrenador ${data_to_receive}`,
    };
    const dialogRef = this.dialog.open(ConfirmModalComponentComponent, {
      width: '400px',
      height: '300px',
      data: data,
    });
    dialogRef.afterClosed().subscribe();
  }

  /**
   *
   * @param trainerNames --> Listado de entrenadores seleccionados.
   */
  assignEnergiestoTrainers(trainerNames: string[]) {
    if (trainerNames.length > 0 && this.selectedEnergie) {
      const creature = this.selectedEnergie;

      this.trainersService
        .assignEnergieToTrainers(trainerNames, creature)
        .subscribe(
          (response) => {
            console.log('Energía asignada con éxito:', response);
            this.modalConfirm(trainerNames);
          },
          (error) => {
            console.error('Error asignando la energía:', error);
            alert('Error asignando la energía');
          }
        );
    } else {
      alert('Por favor, selecciona al menos un entrenador y una energía.');
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
      height: '360px',
    });

    dialogRef
      .afterClosed()
      .subscribe((selectedTrainerNames: string[] | null) => {
        if (selectedTrainerNames && selectedTrainerNames.length > 0) {
          this.selectedTrainerName = selectedTrainerNames.join(', ');
          this.assignEnergiestoTrainers(selectedTrainerNames);
        }
      });
  }
}

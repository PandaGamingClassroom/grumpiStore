import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TrainerService } from '../../services/trainers/trainer.service';
import { Energies, energias } from '../../../models/energies';
import { SelectTrainerComponent } from '../trainers/select-trainer/select-trainer.component';
import { AdminUserService } from '../../services/adminUser/adminUser.service';
import { ConfirmModalComponentComponent } from '../../../segments/confirm-modal-component/confirm-modal-component.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { GrumpiService } from '../../services/grumpi/grumpi.service';

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
  providers: [TrainerService, AdminUserService, GrumpiService],
  templateUrl: './energies.component.html',
  styleUrls: ['./energies.component.scss'],
})
export class EnergiesComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  trainerList: any[] = [];
  selectedEnergie: Energies | null = null;
  selectedTrainerNames: string[] = [];
  energy_list: Energies[] = energias;
  energies: any;
  isAdminUser: boolean = false;
  adminUser: any;
  confirmMessage: string =
    'La energía ha sido asignada con éxito al entrenador.';

  constructor(
    private trainersService: TrainerService,
    private grumpiService: GrumpiService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private adminUserService: AdminUserService
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.adminUser = localStorage.getItem('isAdminUser');
      this.isAdminUser = this.adminUser === 'administrador';
    }

    this.myForm = this.formBuilder.group({
      imagen: [''],
      cantidad: [1], // Campo para la cantidad de energía
    });

    this.getTrainers();
    this.getEnergies();
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

  getEnergies() {
    this.grumpiService.getImageEnergies().subscribe((result) => {
      console.log('Lista de energías: ', result.energy_list);
      this.energies = result.energy_list;
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.myForm.patchValue({ imagen: file });
    }
  }

  assignEnergies(): void {
    const cantidad = this.myForm.get('cantidad')?.value;

    if (
      this.selectedTrainerNames.length > 0 &&
      this.selectedEnergie &&
      cantidad > 0
    ) {
      const creature = this.selectedEnergie;

      for (let i = 0; i < cantidad; i++) {
        this.trainersService
          .assignEnergieToTrainers(this.selectedTrainerNames, creature)
          .subscribe(
            (response) => {
              console.log(`Energía #${i + 1} asignada con éxito:`, response);
            },
            (error) => {
              console.error('Error asignando la energía:', error);
              alert('Error asignando la energía');
            }
          );
      }

      this.modalConfirm(this.selectedTrainerNames);
    } else {
      alert('Por favor, selecciona al menos un entrenador y una energía.');
    }
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
  
  modalConfirm(trainerNames: string[]) {
    const data = {
      title: '¡Energía asignada con éxito!',
      message: `La energía ha sido asignada correctamente a los entrenadores ${trainerNames.join(
        ', '
      )}`,
    };
    const dialogRef = this.dialog.open(ConfirmModalComponentComponent, {
      width: '400px',
      height: '300px',
      data: data,
    });
    dialogRef.afterClosed().subscribe();
  }

  openTrainers() {
    const dialogRef = this.dialog.open(SelectTrainerComponent, {
      width: '400px',
      height: '360px',
    });

    dialogRef
      .afterClosed()
      .subscribe((selectedTrainerNames: string[] | null) => {
        if (selectedTrainerNames && selectedTrainerNames.length > 0) {
          this.selectedTrainerNames = selectedTrainerNames;
          this.assignEnergies();
        }
      });
  }
}

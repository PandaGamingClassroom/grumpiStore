import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TrainerService } from '../../services/trainers/trainer.service';
import { GrumpiService } from '../../services/grumpi/grumpi.service';
import { SelectTrainerComponent } from '../trainers/select-trainer/select-trainer.component';
import { ErrorLoginModalComponentComponent } from '../../../segments/error-login-modal-component/error-login-modal-component.component';
import { ConfirmModalComponentComponent } from '../../../segments/confirm-modal-component/confirm-modal-component.component';


@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, ReactiveFormsModule],
  providers: [TrainerService, GrumpiService],
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss'],
})
export class RewardsComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});

  isAdminUser: boolean = false;
  adminUser: any;

  seeAllRewards: boolean = false;
  selectedRewardsName: any | null = null;
  selectedFile: File | null = null;
  searchTerm: string = '';
  isTypeSelected: boolean = false;

  trainerList: any[] = [];

  rewards_list: any[] = [];

  constructor(
    private trainersService: TrainerService,
    private grumpiService: GrumpiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.adminUser = localStorage.getItem('isAdminUser');
      this.isAdminUser = this.adminUser === 'administrador';
    }
    this.getTrainers();
  }

  /**
   *
   * Se obtienen los datos de los entreandores.
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
   * Función para poder ver las recompensas
   */
  verRecompensas() {
    if (!this.seeAllRewards) {
      this.seeAllRewards = true;
    } else {
      this.seeAllRewards = false;
    }
  }

  /**
   * Función para el filtro de recompensas
   */
  get filteredRewardsImages(): any[] {
    const searchTermLower = this.searchTerm.toLowerCase();

    return this.rewards_list.filter((grumpi) =>
      grumpi.nombre.toLowerCase().includes(searchTermLower)
    );
  }

  /**
   *
   * Se abre una ventana modal en la que se pude hacer una selección
   * de los entrenadores disponibles.
   *
   */
  openTrainers() {
    const dialogRef = this.dialog.open(SelectTrainerComponent, {
      width: '400px',
      height: '360px',
      data: this.selectedRewardsName,
    });

    dialogRef
      .afterClosed()
      .subscribe((selectedTrainerNames: number[] | null) => {
        if (selectedTrainerNames && selectedTrainerNames.length > 0) {
          this.assignRewardsToTrainers(selectedTrainerNames);
        }
      });
  }

  /**
   * Obtención de recompensas disponibles
   */
  getRewards() {
    this.grumpiService.getRewards().subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message);
        } else {
          this.rewards_list = data.rewardsList;
          console.log('Lista de recompensas: ', this.rewards_list);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  assignRewardsToTrainers(trainerIds: number[]) {
    if (!this.selectedRewardsName) {
      console.error('Error: No hay recompensa seleccionada.');
      this.openErrorModal('Error', 'No hay recompensa seleccionada.');
      return;
    }

    trainerIds.forEach((trainerId) => {
      this.trainersService
        .assignReward(trainerId, this.selectedRewardsName)
        .subscribe(
          (response) => {
            const title = '¡Perfecto!';
            const ok = `Recompensa asignada con éxito al entrenador con ID ${trainerId}.`;
            this.openConfirmModal(title, ok);
            console.log(
              `Recompensa asignada con éxito al entrenador con ID ${trainerId}:`,
              response.assignResponse
            );

            if (response.notificationResponse) {
              console.log(
                `Notificación enviada al profesor del entrenador con ID ${trainerId}:`,
                response.notificationResponse
              );
            } else if (response.notificationError) {
              console.error(
                `Error al enviar la notificación para el entrenador con ID ${trainerId}:`,
                response.notificationError
              );
            }
          },
          (error) => {
            console.error(
              `Error asignando la recompensa al entrenador con ID ${trainerId}:`,
              error
            );
          }
        );
    });
  }

  openErrorModal(title: string, message: string) {
    const data = {
      title: title,
      message: message,
    };

    this.dialog.open(ErrorLoginModalComponentComponent, {
      width: '400px',
      height: '300px',
      data: data,
    });
  }

  openConfirmModal(title: string, message: string) {
    const data = {
      title: title,
      message: message,
    };

    this.dialog
      .open(ConfirmModalComponentComponent, {
        width: '400px',
        height: '250px',
        data: data,
      })
      .afterClosed()
      .subscribe((result) => {
        window.location.reload();
      });
  }

  onFileSelected(event: any) {
    const selectedType = event.target.value;
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }

    if (selectedType) {
      this.isTypeSelected = true;
    }
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (!this.selectedFile) {
      console.error('No hay imagen seleccionada');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);
  }
}

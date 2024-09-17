import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { GrumpiService } from '../../services/grumpi/grumpi.service';
import { url_upload_medals } from '../../../models/urls';
import { ConfirmModalComponentComponent } from '../../../segments/confirm-modal-component/confirm-modal-component.component';
import { TrainerService } from '../../services/trainers/trainer.service';
import { SelectTrainerComponent } from '../trainers/select-trainer/select-trainer.component';
import { AdminUserService } from '../../services/adminUser/adminUser.service';
import { FooterComponent } from '../../footer/footer.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-medals-admin-screen',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    FooterComponent,
  ],
  providers: [GrumpiService, TrainerService],
  templateUrl: './medals-admin-screen.component.html',
  styleUrls: ['./medals-admin-screen.component.scss'],
})
export class MedalsAdminScreenComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  selectedFile: File | null = null;
  medalsImages: any[] = [];
  uploadUrl: string = url_upload_medals;
  modalAbierta = false;
  confirmMessage: string = 'Medalla añadida correctamente.';
  searchTerm: string = '';
  selectedMedalName: string | null = null;
  selectedTrainerName: string | null = null;
  trainerList: any[] = [];
  isAdminUser: boolean = false;
  seeAllMedals: boolean = false;
  trainerMedalsMap: { [key: string]: string[] } = {};

  trainer: any;

  constructor(
    private grumpiService: GrumpiService,
    private trainersService: TrainerService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private adminUserService: AdminUserService
  ) {}

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      imagen: [''],
    });
    this.getTrainers();
    this.loadmedalsImages();
    this.adminUserService.adminUser$.subscribe((isAdmin) => {
      this.isAdminUser = isAdmin;
    });
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

  disableRightClick(event: MouseEvent) {
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

  onSubmit(event: Event) {
    event.preventDefault();
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }
    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);
    this.http.post(this.uploadUrl, formData).subscribe(
      (response) => {
        console.log('Imagen subida correctamente', response);
        this.openModal();
      },
      (error: HttpErrorResponse) => {
        console.error('Error al enviar el grumpi', error);
      }
    );
  }

  verMedallas() {
    this.seeAllMedals = !this.seeAllMedals;
  }

  loadmedalsImages() {
    this.grumpiService.getImageMedals().subscribe(
      (response) => {
        this.medalsImages = response.medals_list;
        console.log('URL: ', this.medalsImages);
      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
  }

  openModal() {
    const data = {
      title: '¡Medalla guardada correctamente!',
      message: this.confirmMessage,
    };
    const dialogRef = this.dialog.open(ConfirmModalComponentComponent, {
      width: '400px',
      height: '300px',
      data: data,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.modalAbierta = false;
    });
    this.modalAbierta = true;
  }

  openErrorModal(title: string, message: string) {
    const data = {
      title: title,
      message: message,
    };
    const dialogRef = this.dialog.open(ConfirmModalComponentComponent, {
      width: '400px',
      height: '300px',
      data: data,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.modalAbierta = false;
    });
    this.modalAbierta = true;
  }

  openTrainers() {
    const data = { title: 'Selecciona el entrenador de la lista' };
    const dialogRef = this.dialog.open(SelectTrainerComponent, {
      width: '400px',
      height: '360px',
      data: data,
    });
    dialogRef
      .afterClosed()
      .subscribe((selectedTrainerNames: string[] | null) => {
        if (selectedTrainerNames && selectedTrainerNames.length > 0) {
          this.selectedTrainerName = selectedTrainerNames.join(', ');
          this.assignMedalToTrainer(selectedTrainerNames);
        }
      });
  }

  get filteredMedalsImages(): any[] {
    return this.medalsImages.filter((imageUrl) =>
      imageUrl.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /**
   * Función para asignar una misma medalla a varios entrenadores al mismo tiempo.
   *
   * @param trainerNames
   */
  assignMedalToTrainer(trainerNames: string[]) {
    const titleError = '¡Cuidado!';
    let messageError = '';
    if (trainerNames.length > 0 && this.selectedMedalName) {
      const medal = this.selectedMedalName;

      // Obtener medallas de todos los entrenadores seleccionados
      const trainerRequests = trainerNames.map((trainerName) =>
        this.trainersService.getTrainerByName(trainerName).toPromise()
      );

      forkJoin(trainerRequests).subscribe(
        (trainersData) => {
          trainersData.forEach((data: any) => {
            if (data && data.medallas) {
              this.trainerMedalsMap[data.nombre] = data.medals.map(
                (medal: any) => medal.nombre
              );
            }
          });

          const trainersWithMedal = trainerNames.filter(
            (trainerName) =>
              this.trainerMedalsMap[trainerName] &&
              this.trainerMedalsMap[trainerName].includes(medal)
          );

          if (trainersWithMedal.length > 0) {
            messageError = `La medalla ${medal} ya está asignada a los siguientes entrenadores: ${trainersWithMedal.join(
              ', '
            )}`;

            this.openErrorModal(titleError, messageError);
            return;
          }

          this.trainersService
            .assignMedalToTrainers(trainerNames, medal)
            .subscribe(
              (response) => {
                console.log('Medalla asignada con éxito:', response);
                this.openModal();
              },
              (error) => {
                let errorMssg = 'Error asignando la medalla:' + error;
                this.openErrorModal(titleError, errorMssg);
              }
            );
        },
        (error) => {
          console.error('Error al obtener datos de entrenadores:', error);
        }
      );
    } else {
      alert('Por favor, selecciona al menos un entrenador y una medalla.');
    }
  }
}

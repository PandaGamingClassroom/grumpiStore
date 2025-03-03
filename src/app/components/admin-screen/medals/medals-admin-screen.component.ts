import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  selectedMedalName: any | null = null;
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
      .subscribe((selectedTrainerNames: number[] | null) => {
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
  assignMedalToTrainer(trainerNames: number[]) {
    const titleError = '¡La medalla no se ha podido asignar!';
    let messageError = '';

    if (trainerNames.length > 0 && this.selectedMedalName) {
      const medal = this.selectedMedalName;
      const validTrainerNames: number[] = [];
      let checkedTrainersCount = 0;
      let alreadyHasMedal = false;
      console.log('Nombres del entrenador: ', trainerNames);
      console.log('Medalla seleccionada: ', this.selectedMedalName);
      // Obtener medallas de todos los entrenadores seleccionados
      trainerNames.forEach((trainerName) => {
        this.trainersService.getTrainerById(trainerName).subscribe(
          (trainer: any) => {
            console.log('DATA: ', trainer.data.medallas);

            if (trainer && trainer.data.medallas) {
              const trainerMedals = trainer.data.medallas || [];
              console.log('Medallas del entrenador:', trainerMedals);

              trainerMedals.forEach((medalla: any) => {
                console.log('Nombre en la lista:', medalla.nombre);
              });

              const hasMedal = trainerMedals.some(
                (medalla: any) => medalla.nombre === medal.nombre
              );
              console.log(
                `El entrenador ${trainer.data.name} tiene la medalla:`,
                hasMedal
              );

              if (hasMedal) {
                alreadyHasMedal = true;
              } else {
                validTrainerNames.push(trainerName);
              }
            }

            checkedTrainersCount++;

            if (checkedTrainersCount === trainerNames.length) {
              if (alreadyHasMedal) {
                messageError = `Uno o más entrenadores ya tienen la medalla. No se puede asignar de nuevo.`;
                this.openErrorModal(titleError, messageError);
              } else {
                // Asignar la medalla a los entrenadores válidos
                if (validTrainerNames.length > 0) {
                  this.trainersService
                    .assignMedalToTrainers(validTrainerNames, medal)
                    .subscribe(
                      (response) => {
                        console.log('Medalla asignada con éxito:', response);
                        this.openModal();
                      },
                      (error) => {
                        const errorMsg =
                          'Hemos tenido un problema al asignar la medalla al entrenador.';
                        this.openErrorModal(titleError, errorMsg);
                      }
                    );
                }
              }
            }
          },
          (error) => {
            const errorMsg = 'Error al obtener datos del entrenador.';
            this.openErrorModal(titleError, errorMsg);
          }
        );
      });
    } else {
      const message =
        'Por favor, selecciona al menos un entrenador y una medalla.';
      this.openErrorModal(titleError, message);
    }
  }
}

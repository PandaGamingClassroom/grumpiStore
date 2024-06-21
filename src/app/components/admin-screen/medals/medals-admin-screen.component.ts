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
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { RouterLink } from '@angular/router';
import { GrumpiService } from '../../services/grumpi/grumpi.service';
import { url_upload_medals } from '../../../models/urls';
import { ConfirmModalComponentComponent } from '../../../segments/confirm-modal-component/confirm-modal-component.component';
import { TrainerService } from '../../services/trainers/trainer.service';
import { SelectTrainerComponent } from '../trainers/select-trainer/select-trainer.component';

@Component({
  selector: 'app-medals-admin-screen',
  standalone: true,
  imports: [
    RouterLink,
    NavBarAdminComponent,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  providers: [GrumpiService, TrainerService],
  templateUrl: './medals-admin-screen.component.html',
  styleUrls: ['./medals-admin-screen.component.scss'],
})
export class MedalsAdminScreenComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  selectedFile: File | null = null;
  medalsImages: string[] = [];
  uploadUrl: string = url_upload_medals;
  modalAbierta = false;
  confirmMessage: string = 'Medalla añadida correctamente.';
  searchTerm: string = '';
  selectedMedalName: string | null = null;
  selectedTrainerName: string | null = null;
  trainerList: any[] = [];

  constructor(
    private grumpiService: GrumpiService,
    private trainersService: TrainerService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
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

  loadmedalsImages() {
    this.grumpiService.getImageMedals().subscribe(
      (response) => {
        this.medalsImages = response.imageUrls;
        console.log('URL: ', this.medalsImages);
      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
  }

  openModal() {
    if (!this.modalAbierta) {
      const data = {
        title: '¡Medalla guardada correctamente!',
        message: this.confirmMessage,
      };

      const dialogRef = this.dialog.open(ConfirmModalComponentComponent, {
        width: '400px',
        height: '300px',
        data: data,
      });
      dialogRef.afterClosed().subscribe((result) => {
        window.location.reload();
      });
      this.modalAbierta = true;
    }
  }

  openTrainers() {
    const dialogRef = this.dialog.open(SelectTrainerComponent, {
      width: '400px',
      height: '300px',
    });

    dialogRef.afterClosed().subscribe((selectedTrainerName: string | null) => {
      if (selectedTrainerName) {
        this.selectedTrainerName = selectedTrainerName;
        console.log('Seleccion de entrenador: ', selectedTrainerName);
        this.assignMedal();
      }
    });
  }

  get filteredMedalsImages(): string[] {
    return this.medalsImages.filter((imageUrl) =>
      imageUrl.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  assignMedal(): void {
    if (this.selectedTrainerName !== null && this.selectedMedalName !== null) {
      const trainerName = this.selectedTrainerName;
      const creatureName = this.selectedMedalName;

      this.trainersService
        .assignMedalToTrainer(trainerName, creatureName)
        .subscribe(
          (response) => {
            alert('Medalla asignada con éxito');
          },
          (error) => {
            console.error('Error asignando la medalla:', error);
            alert('Error asignando la medalla');
          }
        );
    } else {
      alert('Por favor, selecciona un entrenador y una medalla.');
    }
  }
}

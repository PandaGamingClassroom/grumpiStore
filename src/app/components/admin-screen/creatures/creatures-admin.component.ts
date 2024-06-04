import { Component, OnInit } from '@angular/core';
import { GrumpiService } from '../../services/grumpi/grumpi.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import { CartaGrumpi, cartas_grumpi } from '../../../models/grumpi';
import { url_upload_grumpis } from '../../../models/urls';
import { ConfirmModalComponentComponent } from '../../../segments/confirm-modal-component/confirm-modal-component.component';
import { TrainerService } from '../../services/trainers/trainer.service';

@Component({
  selector: 'app-creatures-admin',
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
  templateUrl: './creatures-admin.component.html',
  styleUrl: './creatures-admin.component.scss',
})
export class CreaturesAdminComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  grumpis: CartaGrumpi[] = cartas_grumpi;
  selectedFile: File | null = null;
  imageUrls: string[] = [];
  trainerList: any[] = [];
  uploadUrl: string = url_upload_grumpis;
  modalAbierta = false;
  confirmMessage: string = 'Grumpi añadido correctamente.';
  searchTerm: string = '';
  selectedImageUrl: string | null = null;
  selectedTrainerName: string | null = null;
  selectedCreatureName: string | null = null;
  getError: boolean = false;
  trainers: any[] = [];
  grumpiList: any;


  constructor(
    private grumpiService: GrumpiService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private trainersService: TrainerService
  ) {}

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      imagen: [''],
    });
    this.getTrainers();
    this.loadGrumpis();
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

  // Método para cargar la URL de la imagen desde el servidor
  loadImageUrls() {
    this.grumpiService.getImageUrls().subscribe(
      (response) => {
        this.imageUrls = response.imageUrls;
      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
  }

  loadGrumpis() {
    this.grumpiService.getGrumpis().subscribe(
      (response) => {
        this.grumpiList = response.grumpis_list;
      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
  }

  openModal() {
    if (!this.modalAbierta) {
      const data = {
        title: '¡Grumpi guardado correctamente!',
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

  /**
   * Función para filtrar por nombre las imágenes
   */
  get filteredCreaturesImages(): string[] {
    return this.imageUrls.filter((imageUrl) =>
      imageUrl.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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
   * Función para asignar una criatura seleccionada a un entrenador
   */
  assignCreature(): void {
    if (
      this.selectedTrainerName !== null &&
      this.selectedCreatureName !== null
    ) {
      // Obtén el nombre del entrenador seleccionado
      const trainerName = this.selectedTrainerName;

      // Obtén el nombre de la criatura seleccionada
      const creatureName = this.selectedCreatureName;

      // Llama al servicio para asignar la criatura al entrenador por su nombre
      this.trainersService
        .assignCreatureToTrainer(trainerName, creatureName)
        .subscribe(
          (response) => {
            console.log('Criatura asignada con éxito:', response);
            alert('Criatura asignada con éxito');
          },
          (error) => {
            console.error('Error asignando la criatura:', error);
            alert('Error asignando la criatura');
          }
        );
    } else {
      alert('Por favor, selecciona un entrenador y una criatura.');
    }
  }
}

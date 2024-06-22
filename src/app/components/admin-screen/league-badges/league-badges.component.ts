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
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../services/trainers/trainer.service';
import { GrumpiService } from '../../services/grumpi/grumpi.service';
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { url_upload_leagueBadges } from '../../../models/urls';
import { ConfirmModalComponentComponent } from '../../../segments/confirm-modal-component/confirm-modal-component.component';
import { SelectTrainerComponent } from '../trainers/select-trainer/select-trainer.component';
import { AdminUserService } from '../../services/adminUser/adminUser.service';

@Component({
  selector: 'app-league-badges',
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
  providers: [TrainerService, GrumpiService, AdminUserService],
  templateUrl: './league-badges.component.html',
  styleUrl: './league-badges.component.scss',
})
export class LeagueBadgesComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  distintivosImg: string[] = [];
  selectedBadgeName: string | null = null;
  selectedFile: File | null = null;
  uploadUrl: string = url_upload_leagueBadges;
  modalAbierta = false;
  confirmMessage: string = 'El distintivo se ha guardado correctamente.';
  selectedTrainerName: string | null = null;
  trainerList: any[] = [];
  isAdminUser: boolean = false;
  adminUser: any;

  constructor(
    private trainersService: TrainerService,
    private grumpiService: GrumpiService,
    private http: HttpClient,
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
    this.obtenerDistintivos();
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

  obtenerDistintivos() {
    this.grumpiService.getDistintivos().subscribe(
      (response) => {
        console.log('Distintivos: ', response);
        this.distintivosImg = response.imageUrls;
      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
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

  openModal() {
    if (!this.modalAbierta) {
      const data = {
        title: '¡Distintivo añadido!',
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

  assignBadges() {}

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
        this.assignBadges();
      }
    });
  }
}

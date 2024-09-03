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
import { url_upload_leagueBadges } from '../../../models/urls';
import { ConfirmModalComponentComponent } from '../../../segments/confirm-modal-component/confirm-modal-component.component';
import { SelectTrainerComponent } from '../trainers/select-trainer/select-trainer.component';
import { AdminUserService } from '../../services/adminUser/adminUser.service';
import { FooterComponent } from '../../footer/footer.component';
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';

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
    FooterComponent,
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
      });
      this.modalAbierta = true;
    }
  }

  openErrorModal() {
    if (!this.modalAbierta) {
      const data = {
        title: '¡El distintivo no se ha podido asignar!',
        message:
          'Hemos tenido un problema al asignar el distintivo al entrenador.',
      };
      const dialogRef = this.dialog.open(ConfirmModalComponentComponent, {
        width: '400px',
        height: '300px',
        data: data,
      });
      dialogRef.afterClosed().subscribe((result) => {
      });
      this.modalAbierta = true;
    }
  }

  /**
   * Función para asignar un distintivo de liga a varios entrenadores al mismo tiempo.
   *
   * @param trainerNames --> Listado de entrenadores seleccionados.
   */
  assignBadges(trainerNames: string[]) {
    if (trainerNames.length > 0 && this.selectedBadgeName) {
      const badge = this.selectedBadgeName;

      this.trainersService.assignBadgeToTrainers(trainerNames, badge).subscribe(
        (response) => {
          console.log('Distintivo asignado con éxito:', response);
          this.openModal();
        },
        (error) => {
          console.error('Error asignando el distintivo:', error);
          this.openErrorModal();
        }
      );
    } else {
      alert('Por favor, selecciona al menos un entrenador y un distintivo.');
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
          this.assignBadges(selectedTrainerNames);
        }
      });
  }
}

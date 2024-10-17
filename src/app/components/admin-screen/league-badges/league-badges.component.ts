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
  distintivosImg: any[] = [];
  selectedBadgeName: any | null = null;
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
        console.log('Distintivos: ', response.leagueBadges_list);
        this.distintivosImg = response.leagueBadges_list;
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
      dialogRef.afterClosed().subscribe((result) => {});
      this.modalAbierta = true;
    }
  }

  openErrorModal(title: string, message: string) {
    if (!this.modalAbierta) {
      const data = {
        title: title,
        message: message,
      };
      const dialogRef = this.dialog.open(ConfirmModalComponentComponent, {
        width: '400px',
        height: '300px',
        data: data,
      });
      dialogRef.afterClosed().subscribe((result) => {});
      this.modalAbierta = true;
    }
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  /**
   * Función para asignar un distintivo de liga a varios entrenadores al mismo tiempo.
   *
   * @param trainerNames --> Listado de entrenadores seleccionados.
   */
  assignBadges(trainerIds: number[]) {
    if (trainerIds.length > 0 && this.selectedBadgeName) {
      const badgeName = this.selectedBadgeName;
      const validTrainerIds: number[] = [];
      let checkedTrainersCount = 0;
      let alreadyHasBadge = false;

      trainerIds.forEach((trainerID) => {
        this.trainersService.getTrainerById(trainerID).subscribe((trainer) => {
          const trainerBadges = trainer.data.distintivos_liga || [];
          console.log(
            'Lista de distintivos de liga del entrenador: ',
            trainerBadges
          );

          trainerBadges.forEach((badge: any) => {
            console.log('Nombre en la lista:', badge.nombre);
          });
          console.log('Distintivo seleccionado: ', badgeName);
          const hasBadge = trainerBadges.some((badge: any) => {
            badge.nombre.split(' ') === badgeName.nombre.split(' ');
          });
          console.log(
            `El entrenador ${trainer.data.name} tiene la criatura:`,
            hasBadge
          );

          if (hasBadge) {
            alreadyHasBadge = true;
          } else {
            validTrainerIds.push(trainerID);
          }

          checkedTrainersCount++;

          if (checkedTrainersCount === trainerIds.length) {
            if (alreadyHasBadge) {
              const title = '¡Cuidado!';
              const message =
                'Uno o más entrenadores ya tienen este distintivo de liga. No se puede asignar de nuevo.';
              this.openErrorModal(title, message);
              return;
            }

            if (validTrainerIds.length > 0) {
              this.trainersService
                .assignBadgeToTrainers(validTrainerIds, badgeName)
                .subscribe(
                  (response) => {
                    console.log('Distintivo asignado con éxito:', response);
                    this.openModal();
                  },
                  (error) => {
                    const title = '¡Cuidado!';
                    const message = 'Error asignando el distintivo de liga';
                    console.error('Error asignando el distintivo:', error);
                    this.openErrorModal(title, message);
                  }
                );
            }
          }
        });
      });
    } else {
      const title = '¡Cuidado!';
      const message =
        'Por favor, selecciona al menos un entrenador y un distintivo.';
      this.openErrorModal(title, message);
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
      .subscribe((selectedTrainerNames: number[] | null) => {
        if (selectedTrainerNames && selectedTrainerNames.length > 0) {
          this.selectedTrainerName = selectedTrainerNames.join(', ');
          this.assignBadges(selectedTrainerNames);
        }
      });
  }
}

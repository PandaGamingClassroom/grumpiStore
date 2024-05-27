import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MedalsStoreComponent } from './medals-store/medals-store.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GrumpiService } from '../services/grumpi/grumpi.service';
import { TrainerService } from '../services/trainers/trainer.service';
import { ErrorLoginModalComponentComponent } from '../../segments/error-login-modal-component/error-login-modal-component.component';
import { subscribe } from 'diagnostics_channel';
import { ConfirmModalComponentComponent } from '../../segments/confirm-modal-component/confirm-modal-component.component';

@Component({
  selector: 'app-store-screen',
  standalone: true,
  imports: [
    RouterLink,
    NavBarComponent,
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MedalsStoreComponent,
    FooterComponent,
  ],
  providers: [GrumpiService, TrainerService],
  templateUrl: './store-screen.component.html',
  styleUrl: './store-screen.component.scss',
})
export class StoreScreenComponent implements OnInit {
  imageUrls: any;
  evolutionObjects: any;
  grumpidolar: string = '';
  trainer: any;
  username: string | null = '';
  selectedObject: any | null = null;
  errorTitle: string = '¡Imposible realizar la compra!';
  errorMessage: string = 'No dispones de suficientes Grumpidólares.';
  confirmTitle: string = '';
  confirmMessage: string = '';
  trainerName: string = '';

  constructor(
    private grumpiService: GrumpiService,
    private http: HttpClient,
    private trainersService: TrainerService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadImageUrls();
    this.loadEvolutionObjects();
    if (typeof window !== 'undefined') {
      // Verifica si `window` está definido
      this.username = localStorage.getItem('username');
      if (this.username) {
        this.getTrainerData(this.username);
      }
    }
  }

  /**
   * Función para obtener las imágenes de los objetos de combate
   */
  loadImageUrls() {
    this.grumpiService.getCombatObjects().subscribe(
      (response) => {
        this.imageUrls = response.objectsList;
      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
  }

  /**
   * Función para obtener las imágenes de los objetos evolutivos
   */
  loadEvolutionObjects() {
    this.grumpiService.getEvolutionObjects().subscribe(
      (response) => {
        this.evolutionObjects = response.imageUrls;

      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
  }

  /**
   * Función para obtener información sobre el entrenador que ha iniciado sesión
   * @param name recibe el nombre del entrenador
   */
  getTrainerData(name: string): void {
    this.trainersService.getTrainerByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message); // Maneja el mensaje de "Entrenador no encontrado"
        } else {
          this.trainer = data;
          this.grumpidolar = this.trainer.data.grumpidolar;
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  /**
   * Función para comprar el objeto seleccionado.
   *
   * Se tiene en cuenta el precio en grumpidólares del objeto
   * y los grumpiólares disponibles por el entrenador
   *
   * @param grumpidolarTrainer Grumpidólares disponibles por el entrenador.
   * @param price Precio del objeto seleccionado.
   */
  buyCombatObjects() {
    let grumpidolarTrainer: any = this.grumpidolar;
    let price = this.selectedObject.precio;
    let finalCount: number = 0;
    let trainerName = this.trainer.data.name;
    this.confirmTitle = 'Compra realizada';
    this.confirmMessage = 'La compra ha sido realizada correctammente.';

    if (price > grumpidolarTrainer) {
      this.openErrorModal();
    } else {
      finalCount = grumpidolarTrainer - price;
      console.log('Grumpidolares finales para el entrenador: ', finalCount);
      this.trainersService
        .assignGrumpidolaresAfterBuyToTrainer(trainerName, finalCount)
        .subscribe(
          (response) => {
            this.assignCombatObjects();
            this.openConfirmModal(this.confirmTitle, this.confirmMessage);
          },
          (error) => {
            console.error('Error:', error);
          }
        );
    }
  }

  /**
   *
   * Función para asignar los objetos de combate comprados al entrenador
   *
   */
  assignCombatObjects() {
    let trainerName = this.trainer.data.name;
    if (trainerName !== null && this.selectedObject !== null) {
      // Obtén el objeto de combate
      let combatObject = this.selectedObject;

      // Llama al servicio para asignar la criatura al entrenador por su nombre
      this.trainersService
        .assignCombatObjectsToTrainer(trainerName, combatObject)
        .subscribe(
          (response) => {
            this.confirmTitle = 'Objeto conseguido con éxito.';
            this.confirmMessage =
              'Has comprado el objeto ' + combatObject.nombre + ' con éxito.';
            this.openConfirmModal(this.confirmTitle, this.confirmMessage);
          },
          (error) => {
            console.error('Error asignando el objeto de combate:', error);
            alert('Error asignando el objeto de combate');
          }
        );
    } else {
      this.confirmTitle = '¡Cuidado!';
      this.confirmMessage =
        'Por favor, selecciona un entrenador y un objeto de combate.';
      this.openConfirmModal(this.confirmTitle, this.confirmMessage);
    }
  }

  /**
   * Función para invocar a la ventana modal de error.
   */
  openErrorModal() {
    const data = {
      title: this.errorTitle,
      message: this.errorMessage,
    };

    this.dialog.open(ErrorLoginModalComponentComponent, {
      width: '400px',
      height: '300px',
      data: data,
    });
  }

  /**
   * Función para invocar a la ventana modal mostrando el mensaje
   * de confirmación de la acción realizada.
   *
   *
   * @param title Recibe el título de la confirmación
   * @param message Recibe el mensaje para la confirmación
   */
  openConfirmModal(title: string, message: string) {
    const data = {
      title: title,
      message: message,
    };

    this.dialog.open(ConfirmModalComponentComponent, {
      width: '400px',
      height: '300px',
      data: data,
    });
  }
}

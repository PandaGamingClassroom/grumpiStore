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
  errorTitle: string = '';
  errorMessage: string = '';
  confirmTitle: string = '';
  confirmMessage: string = '';
  trainerName: string = '';
  /**
   * CANTIDADES DISPONIBLES DE LAS ENERGÍAS
   */
  cantidadEnergiaAgua: number = 0;
  cantidadEnergiaAire: number = 0;
  cantidadEnergiaLuz: number = 0;
  cantidadEnergiaTierra: number = 0;
  cantidadEnergiaFuego: number = 0;
  cantidadEnergiaVida: number = 0;
  cantidadEnergiaRayo: number = 0;
  cantidadEnergiaNormal: number = 0;
  cantidadEnergiaOscuridad: number = 0;

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
        this.evolutionObjects = response.objectsList;

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
          this.getEnergies(this.trainer, this.trainer.data.energias.tipo);
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
    this.errorTitle = '¡Imposible realizar la compra!';
    this.errorMessage = 'No dispones de suficientes Grumpidólares.';

    if (price > grumpidolarTrainer) {
      this.openErrorModal(this.errorTitle, this.errorMessage);
    } else {
      finalCount = grumpidolarTrainer - price;
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
   * Función para comprar el objeto evolutivo seleccionado.
   *
   */
  buyEvolutionObjects() {
    let price = this.selectedObject.precio;
    let requiredEnergyType = this.selectedObject.tipo;
    let evoObjectSelected = this.selectedObject;
    let trainerName = this.trainer.data.name;
    /**
     * Cantidades de energías de las que dispone el entrenador
     */
    let agua = this.cantidadEnergiaAgua;
    let fuego = this.cantidadEnergiaFuego;
    let aire = this.cantidadEnergiaAire;
    let luz = this.cantidadEnergiaLuz;
    let normal = this.cantidadEnergiaNormal;
    let oscuridad = this.cantidadEnergiaOscuridad;
    let rayo = this.cantidadEnergiaRayo;
    let vida = this.cantidadEnergiaVida;
    let tierra = this.cantidadEnergiaTierra;

    /**
     * Booleano para mostrar mensaje de error
     * en el caso de no disponer de las suficientes energías
     * para comprar el objeto seleccionado
     */
    let error: boolean = false;
    /**
     * Se validan todos los tipos de energía disponibles
     * Se validan los precios de los objetos
     */
    switch (requiredEnergyType) {
      case 'agua':
        {
          if (requiredEnergyType == 'agua' && price <= agua) {
            console.log('Estas comprando losa de agua');
            // Llamada al servicio para añadir el objeto al entrenador
            this.assingEvolutionObjects(trainerName, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      case 'fuego':
        {
          if (requiredEnergyType == 'fuego' && price <= fuego) {
            console.log('Estas comprando losa de fuego');
            this.assingEvolutionObjects(trainerName, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      case 'aire':
        {
          if (requiredEnergyType == 'aire' && price <= aire) {
            console.log('Estas comprando losa de aire');
            this.assingEvolutionObjects(trainerName, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      case 'luz':
        {
          if (requiredEnergyType == 'luz' && price <= luz) {
            console.log('Estas comprando losa de luz');
            this.assingEvolutionObjects(trainerName, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      case 'normal':
        {
          if (requiredEnergyType == 'normal' && price <= normal) {
            console.log('Estas comprando losa de normal');
            this.assingEvolutionObjects(trainerName, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      case 'oscuridad':
        {
          if (requiredEnergyType == 'oscuridad' && price <= oscuridad) {
            console.log('Estas comprando losa de oscuridad');
            this.assingEvolutionObjects(trainerName, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      case 'rayo':
        {
          if (requiredEnergyType == 'rayo' && price <= rayo) {
            console.log('Estas comprando losa de rayo');
            this.assingEvolutionObjects(trainerName, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      case 'tierra':
        {
          if (requiredEnergyType == 'tierra' && price <= tierra) {
            console.log('Estas comprando losa de tierra');
            this.assingEvolutionObjects(trainerName, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      case 'vida':
        {
          if (requiredEnergyType == 'vida' && price <= vida) {
            console.log('Estas comprando losa de vida');
            this.assingEvolutionObjects(trainerName, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      default:
        console.warn(`Tipo de energía desconocido: ${requiredEnergyType}`);
    }

    if (error) {
      this.errorTitle = '¡Imposible realizar la compra!';
      this.errorMessage =
        'No dispones de suficientes energías de tipo: ' +
        requiredEnergyType +
        '.';
      this.openErrorModal(this.errorTitle, this.errorMessage);
    }
  }

  /**
   * Función para llamar al servicio que asigna el objeto seleccionado
   * al entrenador que está en la sesión.
   *
   * @param trainerName Recibe el nombre del entrenador que realiza la compra
   * @param evoObjectSelected Recibe el objeto evolutivo seleccionado.
   */
  assingEvolutionObjects(trainerName: string, evoObjectSelected: any) {
    this.trainersService
      .assignEvolutionObjectsToTrainer(trainerName, evoObjectSelected)
      .subscribe(
        (response) => {
          this.confirmTitle = 'Objeto conseguido con éxito.';
          this.confirmMessage =
            'Has comprado el objeto ' +
            evoObjectSelected.nombre +
            ' con éxito.';
          this.openConfirmModal(this.confirmTitle, this.confirmMessage);
        },
        (error) => {
          this.confirmTitle = '¡Cuidado!';
          this.confirmMessage =
            'Por favor, selecciona un entrenador y un objeto de combate.';
          this.openConfirmModal(this.confirmTitle, this.confirmMessage);
        }
      );
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

  /**
   * Función para obtener la información de las energías del entrenador
   *
   * @param trainerData Obtiene los datos del entrenador
   */
  getEnergies(trainerData: any, typeEnergy: string) {
    let energies = trainerData.data.energias;
    for (let energia of energies) {
      if (energia.tipo == 'Agua') {
        this.cantidadEnergiaAgua++;
      } else if (energia.tipo == 'Fuego') {
        this.cantidadEnergiaFuego++;
      } else if (energia.tipo == 'Aire') {
        this.cantidadEnergiaAire++;
      } else if (energia.tipo == 'Luz') {
        this.cantidadEnergiaLuz++;
      } else if (energia.tipo == 'Normal') {
        this.cantidadEnergiaNormal++;
      } else if (energia.tipo == 'Oscuridad') {
        this.cantidadEnergiaOscuridad++;
      } else if (energia.tipo == 'Rayo') {
        this.cantidadEnergiaRayo++;
      } else if (energia.tipo == 'Tierra') {
        this.cantidadEnergiaTierra++;
      } else if (energia.tipo == 'Vida') {
        this.cantidadEnergiaVida++;
      }
    }
  }
}

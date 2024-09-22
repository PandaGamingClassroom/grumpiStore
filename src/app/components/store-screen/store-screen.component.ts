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
import { MedalsListComponent } from './medals-list/medals-list.component';
import { Energies, energias, iconEnergy } from '../../models/energies';

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
    MedalsListComponent,
  ],
  providers: [GrumpiService, TrainerService],
  templateUrl: './store-screen.component.html',
  styleUrl: './store-screen.component.scss',
})
export class StoreScreenComponent implements OnInit {
  mostrarGrumpidolares = false;
  mostrarEnergias = false;

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
  rewards_list: any;
  isClicked: boolean = false;
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
  cantidadTotal: number = 0;
  totalEnergies: number = 0;
  all_energies: any;
  energies: number[] = [];
  selectedEnergies: { type: string; quantity: number }[] = [];
  selectedEnergie: any;
  energy_list: Energies[] = energias;
  iconListEnergy = iconEnergy;
  showLogo: boolean = true;
  withEnergy: boolean = false;
  withGDolar: boolean = false;
  showCombatObject: boolean = false;
  showEnergys: boolean = false;
  showRewards: boolean = false;
  showObjEvol: boolean = false;

  trainer_id: any;

  constructor(
    private grumpiService: GrumpiService,
    private http: HttpClient,
    private trainersService: TrainerService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadImageUrls();
    this.loadEvolutionObjects();
    this.getRewards();
    this.getAllEnergies();
    if (typeof window !== 'undefined') {
      // Verifica si `window` está definido
      this.username = localStorage.getItem('username');
      this.trainer_id = localStorage.getItem('id_trainer');
      if (this.trainer_id) {
        this.getTrainerData(this.trainer_id);
      }
    }
    this.mostrarGrumpidolares = false;
    this.mostrarEnergias = false;
    console.log('Lista de iconos: ', this.iconListEnergy);
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  /**
   * Función para validar el contenido que se va a mostrar en la tienda Grumpi.
   *
   * @param opcion Recibe una opción seleccionada por el usuario en el menu de la tienda
   */
  seleccionarOpcion(opcion: string) {
    if (opcion === 'grumpidolares') {
      this.mostrarGrumpidolares = true;
      this.mostrarEnergias = false;
      this.withGDolar = true;
      this.withEnergy = false;
      this.showEnergys = false;
      this.showCombatObject = false;
      this.showRewards = false;
      this.showObjEvol = false;
      this.showLogo = true;
    } else if (opcion === 'energias') {
      this.mostrarGrumpidolares = false;
      this.mostrarEnergias = true;
      this.withEnergy = true;
      this.withGDolar = false;
      this.showEnergys = false;
      this.showCombatObject = false;
      this.showRewards = false;
      this.showObjEvol = false;
      this.showLogo = true;
    } else if (opcion === 'objCombat') {
      this.showCombatObject = true;
      this.showEnergys = false;
      this.showRewards = false;
      this.showObjEvol = false;
      this.showLogo = false;
    } else if (opcion === 'objEnergy') {
      this.showEnergys = true;
      this.showCombatObject = false;
      this.showRewards = false;
      this.showObjEvol = false;
      this.showLogo = false;
    } else if (opcion === 'objRewards') {
      this.showEnergys = false;
      this.showCombatObject = false;
      this.showRewards = true;
      this.showObjEvol = false;
      this.showLogo = false;
    } else if (opcion === 'objEvol') {
      this.showEnergys = false;
      this.showCombatObject = false;
      this.showRewards = false;
      this.showObjEvol = true;
      this.showLogo = false;
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
  getTrainerData(id: number): void {
    this.trainersService.getTrainerById(id).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message);
        } else {
          this.trainer = data.data;
          this.grumpidolar = this.trainer.grumpidolar;
          this.getEnergies(this.trainer, this.trainer.energies.tipo);
          console.log('Datos del entrenador en la tienda: ', this.trainer);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

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
    const grumpidolarTrainer: number = Number(this.grumpidolar);
    const price: number = this.selectedObject.precio;
    const trainer_id: number = this.trainer.id;

    if (price > grumpidolarTrainer) {
      this.openErrorModal(this.errorTitle, this.errorMessage);
    } else {
      const finalCount: number = grumpidolarTrainer - price;

      this.trainersService
        .assignGrumpidolaresAfterBuyToTrainer(trainer_id, finalCount)
        .subscribe(
          (response) => {
            console.log(
              'Respuesta del servicio de actualización de los Grumpidólares:',
              response
            );
            this.assignCombatObjects();
          },
          (error) => {
            console.error('Error:', error);
          }
        );
    }
  }

  /**
   *
   * Función para comprar el objeto evolutivo seleccionado.
   *
   */
  buyEvolutionObjects() {
    let price = this.selectedObject.precio;
    let requiredEnergyType = this.selectedObject.tipo;
    let evoObjectSelected = this.selectedObject;
    let trainer_id = Number(this.trainer.id);
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
    console.log(requiredEnergyType);

    switch (requiredEnergyType) {
      case 'agua':
        {
          if (requiredEnergyType == 'agua' && price <= agua) {
            console.log('Estas comprando losa de agua');
            this.assignEvolutionObjects(trainer_id, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      case 'fuego':
        {
          if (requiredEnergyType == 'fuego' && price <= fuego) {
            console.log('Estas comprando losa de fuego');
            this.assignEvolutionObjects(trainer_id, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      case 'aire':
        {
          if (requiredEnergyType == 'aire' && price <= aire) {
            console.log('Estas comprando losa de aire');
            this.assignEvolutionObjects(trainer_id, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      case 'luz':
        {
          if (requiredEnergyType == 'luz' && price <= luz) {
            console.log('Estas comprando losa de luz');
            this.assignEvolutionObjects(trainer_id, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      case 'normal':
        {
          if (requiredEnergyType == 'normal' && price <= normal) {
            console.log('Estas comprando losa de normal');
            this.assignEvolutionObjects(trainer_id, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      case 'oscuridad':
        {
          if (requiredEnergyType == 'oscuridad' && price <= oscuridad) {
            console.log('Estas comprando losa de oscuridad');
            this.assignEvolutionObjects(trainer_id, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      case 'rayo':
        {
          if (requiredEnergyType == 'rayo' && price <= rayo) {
            console.log('Estas comprando losa de rayo');
            this.assignEvolutionObjects(trainer_id, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      case 'tierra':
        {
          if (requiredEnergyType == 'tierra' && price <= tierra) {
            console.log('Estas comprando losa de tierra');
            this.assignEvolutionObjects(trainer_id, evoObjectSelected);
          } else {
            error = true;
          }
        }
        break;
      case 'vida':
        {
          if (requiredEnergyType == 'vida' && price <= vida) {
            console.log('Estas comprando losa de vida');
            this.assignEvolutionObjects(trainer_id, evoObjectSelected);
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
   * @param trainerID Recibe el nombre del entrenador que realiza la compra
   * @param evoObjectSelected Recibe el objeto evolutivo seleccionado.
   */
  assignEvolutionObjects(trainerID: number, evoObjectSelected: any) {
    const requiredEnergies = this.selectedObject?.condicion;
    const totalSelectedEnergies = this.selectedEnergies.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );

    if (totalSelectedEnergies < requiredEnergies) {
      this.confirmTitle = 'Energías insuficientes';
      this.confirmMessage =
        'No tienes suficientes energías para comprar este objeto.';
      this.openConfirmModal(this.confirmTitle, this.confirmMessage);
      return;
    }

    this.trainersService
      .assignEvolutionObjectsToTrainer(trainerID, evoObjectSelected)
      .subscribe(
        (response) => {
          this.trainersService
            .spendEnergies(trainerID, evoObjectSelected.precio)
            .subscribe((data) => {
              this.confirmTitle = 'Objeto conseguido con éxito.';
              this.confirmMessage =
                'Has comprado el objeto ' +
                evoObjectSelected.nombre +
                ' con éxito.';
              this.openConfirmModal(this.confirmTitle, this.confirmMessage);
            });
        },
        (error) => {
          this.confirmTitle = '¡Cuidado!';
          this.confirmMessage =
            'Por favor, selecciona un entrenador y un objeto evolutivo.';
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
    let trainer_id = this.trainer.id;
    if (trainer_id !== null && this.selectedObject !== null) {
      // Obtén el objeto de combate
      let combatObject = this.selectedObject;

      // Llama al servicio para asignar la criatura al entrenador por su nombre
      this.trainersService
        .assignCombatObjectsToTrainer(trainer_id, combatObject)
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

  /**
   * Función para obtener la información de las energías del entrenador
   *
   * @param trainerData Obtiene los datos del entrenador
   */
  getEnergies(trainerData: any, typeEnergy: string) {
    let energies = trainerData.energies;
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
    this.cantidadTotal =
      this.cantidadEnergiaAgua +
      this.cantidadEnergiaFuego +
      this.cantidadEnergiaAire +
      this.cantidadEnergiaLuz +
      this.cantidadEnergiaNormal +
      this.cantidadEnergiaOscuridad +
      this.cantidadEnergiaRayo +
      this.cantidadEnergiaTierra +
      this.cantidadEnergiaVida;
  }

  seeRewards() {
    console.log(this.selectedObject);
    if (this.selectedObject.nombre == 'Recompensa 1') {
      this.handleClick();
    } else if (this.selectedObject.nombre == 'Recompensa 2') {
      this.handleClick();
    } else if (this.selectedObject.nombre == 'Recompensa 3') {
      this.handleClick();
    } else if (this.selectedObject.nombre == 'Recompensa 4') {
      this.handleClick();
    } else if (this.selectedObject.nombre == 'Recompensa 5') {
      this.handleClick();
    }
  }

  /**
   *
   * Función para abrir una ventana con
   * el listado de energías para poder realizar
   * la compra de los objetos.
   *
   */
  openEnergiesTrainer() {
    const dialogRef = this.dialog.open(MedalsListComponent, {
      width: '700px',
      height: '600px',
      data: this.selectedObject,
    });

    dialogRef
      .afterClosed()
      .subscribe(
        (selectedEnergies: { type: string; quantity: number }[] | null) => {
          console.log(
            'Energías seleccionadas por el entrenador: ',
            selectedEnergies
          );

          if (selectedEnergies) {
            this.selectedEnergies = selectedEnergies;
            this.buyRewards();
          }
        }
      );
  }
  handleClick(): void {
    this.isClicked = !this.isClicked;
  }

  selectEnergy(energyType: string, quantity: number): void {
    const index = this.selectedEnergies.findIndex(
      (energy) => energy.type === energyType
    );
    if (index > -1) {
      if (quantity === 0) {
        this.selectedEnergies.splice(index, 1);
      } else {
        this.selectedEnergies[index].quantity = quantity;
      }
    } else if (quantity > 0) {
      this.selectedEnergies.push({ type: energyType, quantity: quantity });
    }
  }

  onEnergiesSelected(
    selectedEnergies: { type: string; quantity: number }[]
  ): void {
    this.selectedEnergies = selectedEnergies;
    this.buyRewards();
  }

  buyRewards(): void {
    const requiredEnergies = this.selectedObject?.condicion;
    const totalSelectedEnergies = this.selectedEnergies.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );

    console.log(
      'Energías seleccionadas por el entrenador: ',
      this.selectedEnergies
    );

    const errorTitle = '¡Cuidado!';
    const errorMessage = 'No tienes energías suficientes.';
    const confirmTitle = '¡Perfecto!';
    const confirmMessage = 'Has adquirido la recompensa.';

    if (requiredEnergies && totalSelectedEnergies >= requiredEnergies) {
      let trainer_id = localStorage.getItem('id_trainer');

      if (trainer_id) {
        const trainerIdNumber = Number(trainer_id);

        if (!isNaN(trainerIdNumber)) {
          this.trainersService
            .spendEnergies(trainerIdNumber, this.selectedEnergies)
            .subscribe((data) => {
              this.totalEnergies = data.totalEnergies;
              this.selectedEnergies = [];

              if (this.selectedObject) {
                this.trainersService
                  .assignReward(trainerIdNumber, this.selectedObject)
                  .subscribe((response) => {
                    console.log(response.message);
                    this.openConfirmModal(confirmTitle, confirmMessage);
                  });
              }
            });
        } else {
          this.openErrorModal('Error', 'ID de entrenador inválido.');
        }
      } else {
        this.openErrorModal('Error', 'No se encontró ID de entrenador.');
      }
    } else {
      this.openErrorModal(errorTitle, errorMessage);
    }
  }

  getAllEnergies() {
    this.grumpiService.getImageEnergies().subscribe((result) => {
      console.log('Lista de energías: ', result.energy_list);
      this.energy_list = result.energy_list;
    });
  }

  assignEnergies() {
    let trainer_id: number = this.trainer.id;
    if (trainer_id !== null && this.selectedEnergie !== null) {
      let energie = this.selectedEnergie;

      this.trainersService.assignEnergie(trainer_id, energie).subscribe(
        (response) => {
          this.confirmTitle = 'Energía conseguida con éxito.';
          this.confirmMessage =
            'Has comprado la energía ' + energie.nombre + ' con éxito.';
          this.openConfirmModal(this.confirmTitle, this.confirmMessage);
        },
        (error) => {
          console.error('Error asignando la energía:', error);
          alert('Error asignando la energía');
        }
      );
    } else {
      this.confirmTitle = '¡Cuidado!';
      this.confirmMessage =
        'Por favor, selecciona un entrenador y una energía.';
      this.openConfirmModal(this.confirmTitle, this.confirmMessage);
    }
  }

  buyEnergy() {
    console.log('Objeto seleccionado para comprar: ', this.selectedEnergie);

    const grumpidolarTrainer: number = Number(this.grumpidolar);
    const price: number = this.selectedEnergie.precio;
    const trainer_id: number = this.trainer.id;

    console.log('Grumpidólares del entrenador: ', grumpidolarTrainer);
    console.log('Precio de la energía seleccionada: ', price);
    console.log('Entrenador que quiere comprar: ', trainer_id);

    if (price > grumpidolarTrainer) {
      this.openErrorModal(this.errorTitle, this.errorMessage);
    } else {
      const finalCount: number = grumpidolarTrainer - price;

      this.trainersService
        .assignGrumpidolaresAfterBuyToTrainer(trainer_id, finalCount)
        .subscribe(
          (response) => {
            console.log(
              'Respuesta del servicio de actualización de los Grumpidólares:',
              response
            );
            this.assignEnergies();
          },
          (error) => {
            console.error('Error:', error);
          }
        );
    }
  }
}

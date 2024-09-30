import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../../services/trainers/trainer.service';

@Component({
  selector: 'app-ver-objetos-modal',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  providers: [TrainerService],
  templateUrl: './edit-objetos-modal.component.html',
  styleUrl: './edit-objetos-modal.component.scss',
})
export class EditObjetosModalComponent implements OnInit {
  /**
   * Nombre del entrenador
   */
  trainer_id: string = '';

  /**
   * Lista de medallas del entrenador
   */
  medals_list: any[] = [];

  /**
   * Variables para el recuento de objetos repetidos
   */
  uniqueCombatObjects: any[] = [];
  uniqueEvolutionObjects: any[] = [];
  uniqueRewards: any[] = [];
  uniqueEnergies: any[] = [];
  uniqueMedals: any[] = [];
  uniqueGrumpis: any[] = [];

  /** Totales de los objetos evolutivos */
  totalLosaAgua: number = 0;
  totalLosaAire: number = 0;
  totalLosaFuego: number = 0;
  totalLosaLuz: number = 0;
  totalLosaNormal: number = 0;
  totalLosaOscuridad: number = 0;
  totalLosaVida: number = 0;
  totalLosaTierra: number = 0;
  totalLosaRayo: number = 0;
  totalPlumaCelestial: number = 0;
  totalPlumaOscura: number = 0;
  totalBalanza: number = 0;

  /** Totales de las recompensas */
  totalRecompensa1: number = 0;
  totalRecompensa2: number = 0;
  totalRecompensa3: number = 0;
  totalRecompensa4: number = 0;
  totalRecompensa5: number = 0;

  /** Energías */
  energiaNormal: number = 0;
  energiaAgua: number = 0;
  energiaAire: number = 0;
  energiaFuego: number = 0;
  energiaLuz: number = 0;
  energiaOscuridad: number = 0;
  energiaRayo: number = 0;
  energiaTierra: number = 0;
  energiaVida: number = 0;

  trainer: any;

  constructor(
    public dialogRef: MatDialogRef<EditObjetosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public objetos: any,
    private trainersService: TrainerService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.trainer = this.objetos;
    console.log('MOCHILA DEL ENTRENADOR :', this.trainer);

    this.trainer_id = this.trainer?.id || '';
    this.contadorObjetosCombate(
      JSON.parse(this.trainer?.objetos_combate || '[]')
    );
    this.contadorObjEvolutivos(
      JSON.parse(this.trainer?.objetos_evolutivos || '[]')
    );
    this.contadorRecompensas(JSON.parse(this.trainer?.recompensas || '[]'));
    this.contadorEnergias(JSON.parse(this.trainer?.energias || '[]'));
    this.contadorMedallas(JSON.parse(this.trainer?.medallas || '[]'));
    this.contadorGrumpis(JSON.parse(this.trainer?.grumpis || '[]'));
  }

  /**
   * Función para contabilizar el total de objetos de combate que tiene en el inventario
   * el entrenador seleccionado.
   * @param combatObjects Recibe el listado de objetos de combate del entrenador seleccionado
   */
  contadorObjetosCombate(combatObjects: any) {
    console.log('Lista de objetos de combate del entrenador: ', combatObjects);
    const objectCounts: { [key: string]: any } = {};

    for (let obj of combatObjects) {
      if (!objectCounts[obj.nombre]) {
        objectCounts[obj.nombre] = { ...obj, count: 0 };
      }
      objectCounts[obj.nombre].count++;
    }

    this.uniqueCombatObjects = Object.values(objectCounts);
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  /**
   * Función para contabilizar el total de objetos evolutivos que tiene en el inventario
   * el entrenador seleccionado.
   * @param evolutionObjects Recibe el listado de objetos evolutivos del entrenador seleccionado
   */
  contadorObjEvolutivos(evolutionObjects: any) {
    console.log(
      'Lista de objetos evolutivos del entrenador: ',
      evolutionObjects
    );

    const objectCounts: { [key: string]: any } = {};

    for (let obj of evolutionObjects) {
      if (!objectCounts[obj.nombre]) {
        objectCounts[obj.nombre] = { ...obj, count: 0 };
      }
      objectCounts[obj.nombre].count++;
    }

    this.uniqueEvolutionObjects = Object.values(objectCounts);

    this.totalLosaAgua = objectCounts['Losa Agua']?.count || 0;
    this.totalLosaAire = objectCounts['Losa Aire']?.count || 0;
    this.totalLosaFuego = objectCounts['Losa Fuego']?.count || 0;
    this.totalLosaLuz = objectCounts['Losa Luz']?.count || 0;
    this.totalLosaNormal = objectCounts['Losa Normal']?.count || 0;
    this.totalLosaOscuridad = objectCounts['Losa Oscuridad']?.count || 0;
    this.totalLosaRayo = objectCounts['Losa Rayo']?.count || 0;
    this.totalLosaTierra = objectCounts['Losa Tierra']?.count || 0;
    this.totalLosaVida = objectCounts['Losa Vida']?.count || 0;
    this.totalBalanza = objectCounts['Balanza del orden']?.count || 0;
    this.totalPlumaCelestial = objectCounts['Pluma celestial']?.count || 0;
    this.totalPlumaOscura = objectCounts['Pluma oscura']?.count || 0;
  }

  /**
   * Función para hacer un recuento de las recompensas que tiene el entrenador
   * @param rewards Obtiene la lista de recompensas del entrenador
   */
  contadorRecompensas(rewards: any) {
    const rewardCounts: { [key: string]: any } = {};

    for (let reward of rewards) {
      if (!rewardCounts[reward.nombre]) {
        rewardCounts[reward.nombre] = { ...reward, count: 0 };
      }
      rewardCounts[reward.nombre].count++;
    }

    this.uniqueRewards = Object.values(rewardCounts);

    // Contadores individuales, si aún son necesarios
    this.totalRecompensa1 = rewardCounts['Recompensa 1']?.count || 0;
    this.totalRecompensa2 = rewardCounts['Recompensa 2']?.count || 0;
    this.totalRecompensa3 = rewardCounts['Recompensa 3']?.count || 0;
    this.totalRecompensa4 = rewardCounts['Recompensa 4']?.count || 0;
    this.totalRecompensa5 = rewardCounts['Recompensa 5']?.count || 0;
  }

  contadorEnergias(energies: any) {
    console.log('Lista de energías del entrenador: ', energies);

    const energyCounts: { [key: string]: any } = {};

    for (let energy of energies) {
      if (!energyCounts[energy.nombre]) {
        energyCounts[energy.nombre] = { ...energy, count: 0 };
      }
      energyCounts[energy.nombre].count++;
    }

    this.uniqueEnergies = Object.values(energyCounts);

    // Set the specific energy counts
    for (let energy of this.uniqueEnergies) {
      switch (energy.nombre) {
        case 'Agua':
          this.energiaAgua = energy.count;
          break;
        case 'Fuego':
          this.energiaFuego = energy.count;
          break;
        case 'Aire':
          this.energiaAire = energy.count;
          break;
        case 'Luz':
          this.energiaLuz = energy.count;
          break;
        case 'Normal':
          this.energiaNormal = energy.count;
          break;
        case 'Oscuridad':
          this.energiaOscuridad = energy.count;
          break;
        case 'Rayo':
          this.energiaRayo = energy.count;
          break;
        case 'Tierra':
          this.energiaTierra = energy.count;
          break;
        case 'Vida':
          this.energiaVida = energy.count;
          break;
      }
    }
  }

  // Ajusta el contador de medallas para que cree objetos de medallas
  contadorMedallas(medallas: any[]) {
    console.log('Lista de medallas del entrenador: ', medallas);

    const medallaCounts: { [key: string]: any } = {};

    for (let medalla of medallas) {
      if (!medallaCounts[medalla.id]) {
        medallaCounts[medalla.id] = {
          id: medalla.id,
          nombre: medalla.nombre,
          imagen: medalla.imagen,
          toDelete: false,
        };
      }
    }

    this.uniqueMedals = Object.values(medallaCounts);
  }

  /**
   * Función para eliminar Grumpis de la lista del entrenador.
   *
   * @param grumpis Recibe el listado de Grumpis marcados para eliminar.
   */
  contadorGrumpis(grumpis: any[]) {
    console.log('Lista de grumpis del entrenador: ', grumpis);

    const grumpiCounts: { [nombre: string]: any } = {};

    for (let grumpi of grumpis) {
      if (!grumpiCounts[grumpi.nombre]) {
        grumpiCounts[grumpi.nombre] = { ...grumpi, toDelete: false };
      }
    }

    this.uniqueGrumpis = Object.values(grumpiCounts);

    this.uniqueGrumpis.sort((a: any, b: any) => a.n_grumpidex - b.n_grumpidex);
  }

  eliminarGrumpi(grumpi: any) {
    const objetosAEliminar: any[] = [];

    if (confirm(`¿Seguro que deseas eliminar a ${grumpi.nombre}?`)) {
      this.uniqueGrumpis = this.uniqueGrumpis.filter(
        (item) => item.nombre === grumpi.nombre
      );

      console.log('uniqueGrumpis: ', this.uniqueGrumpis);

      console.log(`Grumpi ${grumpi.nombre} eliminado de la lista local.`);

      for (const grumpi of this.uniqueGrumpis) {
        if (grumpi.toDelete) {
          objetosAEliminar.push({
            tipo: 'grumpi',
            nombre: grumpi.nombre,
            cantidad: grumpi.quantityToDelete || 1,
          });
        }
      }

      if (objetosAEliminar.length > 0) {
        console.log('Objetos a eliminar: ', objetosAEliminar);

        // Actualizar el entrenador con los objetos eliminados
        this.trainersService
          .updateTrainer(this.trainer_id, { objetosAEliminar })
          .subscribe(
            (response) => {
              console.log(
                'Objetos eliminados y entrenador actualizado correctamente:',
                response
              );
              this.close(); // Cerrar modal o realizar acción adicional
            },
            (error) => {
              console.error('Error al eliminar objetos:', error);
            }
          );
      } else {
        console.log('No hay objetos para eliminar.');
        this.close(); // Cerrar modal o realizar acción adicional si no hay objetos
      }
    }
  }

  // Ajusta la función para eliminar objetos
  eliminarObjetos() {
    const objetosAEliminar: any[] = [];

    // Grumpis
    console.log('UNIQUE_GRUMPIS', this.uniqueGrumpis);

    for (const grumpi of this.uniqueGrumpis) {
      if (grumpi.toDelete > 0) {
        objetosAEliminar.push({
          tipo: 'grumpi',
          nombre: grumpi.nombre,
          cantidad: grumpi.quantityToDelete,
        });
      }
    }

    // Energías
    console.log('UNIQUE_ENERGIES', this.uniqueEnergies);

    for (const energia of this.uniqueEnergies) {
      if (energia.quantityToDelete > 0) {
        objetosAEliminar.push({
          tipo: 'energia',
          nombre: energia.nombre,
          cantidad: energia.quantityToDelete,
        });
      }
    }

    // Medallas
    console.log('UNIQUE_MEDALLAS', this.uniqueMedals);

    for (const medalla of this.uniqueMedals) {
      if (medalla.toDelete) {
        objetosAEliminar.push({
          tipo: 'medalla',
          nombre: medalla.nombre,
        });
      }
    }

    // Objetos de combate
    console.log('UNIQUE_COMBATOBJECTS', this.uniqueCombatObjects);

    for (const objeto of this.uniqueCombatObjects) {
      if (objeto.quantityToDelete > 0) {
        objetosAEliminar.push({
          tipo: 'combate',
          nombre: objeto.nombre,
          cantidad: objeto.quantityToDelete,
        });
      }
    }

    // Objetos evolutivos
    console.log('UNIQUE_EVOOBJECTS', this.uniqueEvolutionObjects);

    for (const objeto of this.uniqueEvolutionObjects) {
      if (objeto.quantityToDelete > 0) {
        objetosAEliminar.push({
          tipo: 'evolutivo',
          nombre: objeto.nombre,
          cantidad: objeto.quantityToDelete,
        });
      }
    }

    // Recompensas
    console.log('UNIQUE_REWARDS', this.uniqueRewards);

    for (const objeto of this.uniqueRewards) {
      if (objeto.quantityToDelete > 0) {
        objetosAEliminar.push({
          tipo: 'recompensa',
          nombre: objeto.nombre,
          cantidad: objeto.quantityToDelete,
        });
      }
    }

    if (objetosAEliminar.length > 0) {
      console.log('Objetos a eliminar: ', objetosAEliminar);

      this.trainersService
        .updateTrainer(this.trainer_id, {
          objetosAEliminar,
        })
        .subscribe(
          (response) => {
            console.log(
              'Objetos eliminados y entrenador actualizado correctamente:',
              response
            );
            this.close();
          },
          (error) => {
            console.error('Error al eliminar objetos:', error);
          }
        );
    } else {
      console.log('No hay objetos para eliminar.');
    }
  }

  /**
   * Función para cerrar la ventana emergente
   */
  close(): void {
    this.dialogRef.close();
  }
}

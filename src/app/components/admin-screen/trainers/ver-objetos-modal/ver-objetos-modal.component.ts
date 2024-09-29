import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';

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
  templateUrl: './ver-objetos-modal.component.html',
  styleUrl: './ver-objetos-modal.component.scss',
})
export class VerObjetosModalComponent implements OnInit {
  /**
   * Nombre del entrenador
   */
  trainer_name: string = '';

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

  grumpiList: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<VerObjetosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public objetos: any
  ) { }

  ngOnInit(): void {
    console.log('Datos iniciales:', this.objetos);
    this.trainer_name = this.objetos?.name || '';
    this.medals_list = JSON.parse(this.objetos?.medallas) || '';
    this.contadorObjetosCombate(this.objetos?.objetos_combate || []);
    this.contadorObjEvolutivos(this.objetos?.objetos_evolutivos || []);
    this.contadorRecompensas(this.objetos?.recompensas || []);
    this.contadorEnergias(this.objetos?.energias || []);
    this.contadorMedallas(this.objetos?.medallas || []);
    this.contadorGrumpis(this.objetos?.grumpis || []);
    this.grumpiList = this.objetos?.grumpis || [];
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  /**
   * Función para contabilizar el total de objetos de combate que tiene en el inventario
   * el entrenador seleccionado.
   * @param combatObjects Recibe el listado de objetos de combate del entrenador seleccionado
   */
  contadorObjetosCombate(combatObjects: any) {
    const objectCounts: { [key: string]: any } = {};

    for (let obj of combatObjects) {
      if (!objectCounts[obj.nombre]) {
        objectCounts[obj.nombre] = { ...obj, count: 0 };
      }
      objectCounts[obj.nombre].count++;
    }

    this.uniqueCombatObjects = Object.values(objectCounts);
  }

  /**
   * Función para contabilizar el total de objetos evolutivos que tiene en el inventario
   * el entrenador seleccionado.
   * @param evolutionObjects Recibe el listado de objetos evolutivos del entrenador seleccionado
   */
  contadorObjEvolutivos(evolutionObjects: any) {
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
    const medallaCounts: { [key: string]: any } = {};

    for (let medalla of medallas) {
      if (!medallaCounts[medalla]) {
        medallaCounts[medalla] = { url: medalla, toDelete: false };
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
    const grumpiCounts: { [nombre: string]: any } = {};

    for (let grumpi of grumpis) {
      if (!grumpiCounts[grumpi.nombre]) {
        grumpiCounts[grumpi.nombre] = { ...grumpi, toDelete: false };
      }
    }

    this.uniqueGrumpis = Object.values(grumpiCounts);
  }


  /**
   * Función para cerrar la ventana emergente
   */
  close(): void {
    this.dialogRef.close();
  }
}

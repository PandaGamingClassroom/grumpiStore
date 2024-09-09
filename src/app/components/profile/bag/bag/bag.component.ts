import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../../nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TrainerService } from '../../../services/trainers/trainer.service';
import { FooterComponent } from '../../../footer/footer.component';
import { GrumpiService } from '../../../services/grumpi/grumpi.service';
import { ViewImageComponent } from '../../../../segments/view-image/view-image.component';

@Component({
  selector: 'app-bag',
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
    FooterComponent,
  ],
  providers: [TrainerService, GrumpiService],
  templateUrl: './bag.component.html',
  styleUrl: './bag.component.scss',
})
export class BagComponent implements OnInit {
  marcasCombate: any;
  username: string | null = '';
  trainer: any;
  errorMessage: string = '';
  energies: any;
  energiaNormal: number = 0;
  energiaAgua: number = 0;
  energiaAire: number = 0;
  energiaFuego: number = 0;
  energiaLuz: number = 0;
  energiaOscuridad: number = 0;
  energiaRayo: number = 0;
  energiaTierra: number = 0;
  energiaVida: number = 0;
  activeTab: string = '';
  rewards_list: any;
  rewards_total_list: any;
  filteredGrumpis: any[] = [];
  grumpiList: any[] = [];

  /** Totales de las recompensas */
  totalRecompensa1: number = 0;
  totalRecompensa2: number = 0;
  totalRecompensa3: number = 0;
  totalRecompensa4: number = 0;
  totalRecompensa5: number = 0;

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

  uniqueCombatObjects: any[] = [];
  uniqueEvolutionObjects: any[] = [];
  uniqueRewards: any[] = [];
  uniqueEnergies: any[] = [];
  uniqueMedals: any[] = [];

  searchTerm: string = '';

  constructor(
    private trainersService: TrainerService,
    private grumpiService: GrumpiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      // Verifica si `window` está definido
      this.username = localStorage.getItem('username');
      if (this.username) {
        this.getTrainerData(this.username);
        this.getEnergies();
        this.getRewards();
      }
    }
  }

  /**
   * Función para obtener información sobre el entrenador que ha iniciado sesión
   * @param name recibe el nombre del entrenador
   */
  getTrainerData(name: string): void {
    let energyTrainer: any;
    this.trainersService.getTrainerByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message); // Maneja el mensaje de "Entrenador no encontrado"
        } else {
          this.trainer = data;
          this.grumpiList = JSON.parse(this.trainer.grumpis)
          energyTrainer = this.trainer.data.energias;
          this.rewards_list = this.trainer.data.recompensas;
          this.contadorRecompensas(this.rewards_list);
          this.contadorLosas(this.trainer.data.objetos_evolutivos);
          this.contadorObjetosCombate(this.trainer.data.objetos_combate);
          this.contadorEnergias(energyTrainer);
          this.contadorMedallas(this.trainer.data.medallas);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  /**
   * Función para hacer un recuento de las energías que tiene el entrenador.
   * @param energyOfTrainer Obtiene la lista de energías del entrenador
   */
  energyCount(energyOfTrainer: any) {
    for (let type of energyOfTrainer) {
      if (type.tipo === 'Fuego') {
        this.energiaFuego++;
      } else if (type.tipo === 'Agua') {
        this.energiaAgua++;
      } else if (type.tipo === 'Aire') {
        this.energiaAire++;
      } else if (type.tipo === 'Luz') {
        this.energiaLuz++;
      } else if (type.tipo === 'Normal') {
        this.energiaNormal++;
      } else if (type.tipo === 'Oscuridad') {
        this.energiaOscuridad++;
      } else if (type.tipo === 'Rayo') {
        this.energiaRayo++;
      } else if (type.tipo === 'Tierra') {
        this.energiaTierra++;
      } else if (type.tipo === 'Vida') {
        this.energiaVida++;
      }
    }
  }

  /**
   * Función para obtener todas las energías disponibles
   */
  getEnergies() {
    this.grumpiService.getImageEnergies().subscribe((result) => {
      console.log('Lista de energías: ', result.imageUrls);
      this.energies = result.imageUrls;
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  /**
   * Función para hacer un recuento de las recompensas que tiene el entrenador
   * @param rewards Obtiene la lista de recompensas del entrenador
   */
  contadorRecompensas(rewards: any) {
    console.log('Recompensas del entrenador: ', rewards);

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

  /**
   * Función para hacer un recuento de cada objeto evolutivo que tiene el entrenador.
   * @param combatObjects Recibe la lista de objetos evolutivos que tiene el entrenador
   */
  contadorLosas(combatObjects: any) {
    console.log('Objetos evolutivos del entrenador: ', combatObjects);

    const objectCounts: { [key: string]: any } = {};

    for (let obj of combatObjects) {
      if (!objectCounts[obj.nombre]) {
        objectCounts[obj.nombre] = { ...obj, count: 0 };
      }
      objectCounts[obj.nombre].count++;
    }

    this.uniqueEvolutionObjects = Object.values(objectCounts);

    // Contadores individuales, si aún son necesarios
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

  contadorObjetosCombate(combatObjects: any) {
    console.log('Objetos de combate del entrenador: ', combatObjects);

    const objectCounts: { [key: string]: any } = {};

    for (let obj of combatObjects) {
      if (!objectCounts[obj.nombre]) {
        objectCounts[obj.nombre] = { ...obj, count: 0 };
      }
      objectCounts[obj.nombre].count++;
    }

    this.uniqueCombatObjects = Object.values(objectCounts);
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

  contadorMedallas(medals: any){
    console.log('Medallas del entrenador: ', medals);

  }

  /**
   * Función para obtener todas las recompensas disponibles
   */
  getRewards() {
    this.grumpiService.getRewards().subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message); // Maneja el mensaje de "Entrenador no encontrado"
        } else {
          this.rewards_total_list = data.rewardsList;
          console.log('Lista de recompensas: ', this.rewards_total_list);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  openGrumpi(creature: any) {
    const dialogRef = this.dialog.open(ViewImageComponent, {
      width: '700px',
      height: '600px',
      data: creature,
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  openMedal(medal: any) {
    const dialogRef = this.dialog.open(ViewImageComponent, {
      width: '700px',
      height: '600px',
      data: medal,
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  openEnergy(energy: any) {
    const dialogRef = this.dialog.open(ViewImageComponent, {
      width: '700px',
      height: '600px',
      data: energy,
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  openCombatObject(combatObject: any) {
    const dialogRef = this.dialog.open(ViewImageComponent, {
      width: '700px',
      height: '600px',
      data: combatObject,
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  openReward(reward: any) {
    const dialogRef = this.dialog.open(ViewImageComponent, {
      width: '700px',
      height: '600px',
      data: reward,
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  // Función para filtrar los Grumpis según el término de búsqueda
  get filteredCreaturesImages(): any[] {
    if (!this.trainer || !this.trainer.data || !this.grumpiList) {
      return [];
    }
    return this.grumpiList.filter((creature: any) =>
      creature.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}

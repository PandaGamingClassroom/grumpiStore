import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../../nav-bar/nav-bar.component';
import { Grumpi, grumpis } from '../../../../models/grumpi';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TrainerService } from '../../../services/trainers/trainer.service';
import { FooterComponent } from '../../../footer/footer.component';
import { GrumpiService } from '../../../services/grumpi/grumpi.service';

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
  grumpis: Grumpi[] = grumpis;
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

  totalEnergia1: number = 0;
  totalEnergia2: number = 0;
  totalEnergia3: number = 0;
  totalEnergia4: number = 0;
  totalEnergia5: number = 0;

  constructor(
    private trainersService: TrainerService,
    private grumpiService: GrumpiService
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
          energyTrainer = this.trainer.data.energias;
          this.rewards_list = this.trainer.data.recompensas;
          this.contadorRecompensas(this.rewards_list);
          this.energyCount(energyTrainer);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

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

  getEnergies() {
    this.grumpiService.getImageEnergies().subscribe((result) => {
      console.log('Lista de energías: ', result.imageUrls);
      this.energies = result.imageUrls;
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  contadorRecompensas(rewards: any) {
    console.log(rewards);
    for (let reward of rewards) {
      if (reward.nombre == 'Recompensa 1') {
        this.totalEnergia1++;
      } else if (reward.nombre == 'Recompensa 2') {
        this.totalEnergia2++;
      } else if (reward.nombre == 'Recompensa 3') {
        this.totalEnergia3++;
      } else if (reward.nombre == 'Recompensa 4') {
        this.totalEnergia4++;
      } else if (reward.nombre == 'Recompensa 5') {
        this.totalEnergia5++;
      }

    }

  }

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
}

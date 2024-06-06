import { Component, OnInit } from '@angular/core';
import { BattleService } from '../services/battle/battle.service';
import { Attacks, Grumpi } from '../../models/grumpi';
import { TrainerService } from '../services/trainers/trainer.service';
import { GrumpiService } from '../services/grumpi/grumpi.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-battle-game',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  providers: [GrumpiService, TrainerService],
  templateUrl: './battle-game.component.html',
  styleUrls: ['./battle-game.component.scss'],
})
export class BattleGameComponent implements OnInit {
  log: string[] = [];
  grumpiList: any;
  username: string | null = '';
  trainer: any;
  selectedGrumpi: any | null = null;
  randomGrumpi: any | null = null;

  constructor(
    private grumpiService: GrumpiService,
    private trainersService: TrainerService
  ) {}

  ngOnInit() {
    this.loadGrumpis();
    if (typeof window !== 'undefined') {
      // Verifica si `window` está definido
      this.username = localStorage.getItem('username');
      if (this.username) {
        this.getTrainerData(this.username);
      }
    }
  }

  getTrainerData(name: string): void {
    this.trainersService.getTrainerByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message); // Maneja el mensaje de "Entrenador no encontrado"
        } else {
          this.trainer = data;
          this.grumpiList = data;
          console.log('Datos del entrenador: ', this.trainer.data);
          console.log('Grumpis del entrenador: ', this.grumpiList.data.grumpis);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  loadGrumpis() {
    this.grumpiService.getGrumpis().subscribe(
      (response) => {
        this.grumpiList = response.grumpis_list;
        console.log('Lista de Grumpis: ', this.grumpiList);
        this.randomGrumpi = this.getRandomGrumpi(); // Llamar a getRandomGrumpi después de cargar los Grumpis
      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
  }

  // Función para obtener un Grumpi aleatorio de la lista cargada
  getRandomGrumpi() {
    if (!this.grumpiList || this.grumpiList.length === 0) {
      console.error(
        'La lista de Grumpis está vacía. Asegúrese de haber llamado a loadGrumpis primero.'
      );
      return null;
    }

    const randomIndex = Math.floor(Math.random() * this.grumpiList.length);
    const randomGrumpi = this.grumpiList[randomIndex];
    console.log('Grumpi aleatorio seleccionado: ', randomGrumpi);
    return randomGrumpi;
  }

  attack(attacker: Grumpi, defender: Grumpi, move: Attacks) {}

  selectCreature() {
    console.log('Grumpi seleccionado: ', this.selectedGrumpi);
  }
}

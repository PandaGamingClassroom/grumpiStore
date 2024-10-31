import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../services/trainers/trainer.service';
import { GrumpiService } from '../services/grumpi/grumpi.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-battle-game',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    NavBarComponent,
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
  playerTurn: boolean = false;

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
    this.startBattle();
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

  startBattle() {
    this.log = [];
    this.playerTurn = Math.random() < 0.5;
    this.log.push(
      this.playerTurn ? 'Player starts first!' : 'Opponent starts first!'
    );
    if (!this.playerTurn) {
      this.opponentAttack();
    }
  }

  selectCreature() {
    console.log('Grumpi seleccionado: ', this.selectedGrumpi);
  }

  playerAttack(atk: any) {
    if (this.playerTurn) {
      this.randomGrumpi.PS -= atk.efecto;
      this.log.push(
        `Player's ${this.selectedGrumpi.nombre} used ${atk.nombre} and dealt ${atk.efecto} damage!`
      );
      this.checkBattleStatus();
    }
  }

  opponentAttack() {
    if (!this.playerTurn) {
      const randomAttack =
        this.randomGrumpi.ataques[
          Math.floor(Math.random() * this.randomGrumpi.ataques.length)
        ];
      this.selectedGrumpi.PS -= randomAttack.damage;
      this.log.push(
        `Opponent's ${this.randomGrumpi.nombre} used ${randomAttack.nombre} and dealt ${randomAttack.efecto} damage!`
      );
      this.checkBattleStatus();
    }
  }

  checkBattleStatus() {
    if (this.selectedGrumpi.PS <= 0) {
      this.log.push(`Player's ${this.selectedGrumpi.nombre} has fainted!`);
      this.endBattle(false); // La batalla termina en derrota para el jugador
    } else if (this.randomGrumpi.PS <= 0) {
      this.log.push(`Opponent's ${this.randomGrumpi.nombre} has fainted!`);
      this.endBattle(true); // La batalla termina en victoria para el jugador
    } else {
      this.playerTurn = !this.playerTurn; // Cambia de turno
      if (!this.playerTurn) {
        setTimeout(() => this.opponentAttack(), 1000); // Ataque del oponente después de 1s
      }
    }
  }

  endBattle(playerWon: boolean) {
    this.log.push(playerWon ? 'You won the battle!' : 'You lost the battle.');
    this.playerTurn = false; // Desactiva los turnos cuando la batalla termina
    // Puedes añadir una lógica adicional, como la opción de reiniciar la batalla o volver al menú principal
  }
}

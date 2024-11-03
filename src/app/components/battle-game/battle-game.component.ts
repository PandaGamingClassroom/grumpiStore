import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
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
export class BattleGameComponent implements OnInit, OnDestroy {
  log: string[] = [];
  grumpiList: any[] = [];
  username: string | null = '';
  trainer: any;
  selectedGrumpi: any | null = null;
  randomGrumpi: any | null = null;
  playerTurn: boolean = false;
  battleFinished: boolean = false;
  resultMessage: string = '';
  playerWon: boolean = false;
  pause_music: boolean = true;
  audio: HTMLAudioElement;
  loading: boolean = true;

  @ViewChild('logContainer') logContainer!: ElementRef;

  constructor(
    private grumpiService: GrumpiService,
    private trainersService: TrainerService
  ) {
    this.loadGrumpis();
    this.audio = new Audio('../../../assets/game/audio_game/Grumpi.mp3');
    this.audio.loop = true;
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.username = localStorage.getItem('username');
      if (this.username) {
        this.getTrainerData(this.username);
        // this.audio.play().catch((error) => {
        //   console.log(
        //     'Reproducción pausada hasta que el usuario interactúe.',
        //     error
        //   );
        // });
      }
    }
  }

  /**
   * Obtiene los datos del entrenador que ha iniciado sesión
   * @param name
   */
  getTrainerData(name: string): void {
    this.trainersService.getTrainerByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message);
        } else {
          this.trainer = data;
          this.grumpiList = data.data.grumpis || [];
          console.log('Datos del entrenador: ', this.trainer);
          console.log('Grumpis del entrenador: ', this.grumpiList);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  /**
   * Obtiene el listado completo de Grumpis en BBDD
   */
  loadGrumpis() {
    this.grumpiService.getGrumpis().subscribe(
      (response) => {
        this.grumpiList = response.grumpis_list;
        this.randomGrumpi = this.getRandomGrumpi();
      },
      (error) => {
        console.error('Error al obtener la lista de Grumpis:', error);
      }
    );
  }

  /**
   * Selecciona un Grumpi aleatorio de toda la lista.
   *
   * @returns
   */
  getRandomGrumpi() {
    if (!this.grumpiList || this.grumpiList.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * this.grumpiList.length);
    return this.grumpiList[randomIndex];
  }

  /**
   * Selecciona el grumpi que ha marcado el entrenador
   * @param grumpi
   */
  selectCreature(grumpi: any) {
    this.selectedGrumpi = grumpi;
    console.log('Grumpi seleccionado: ', this.selectedGrumpi);
    this.loading = false;
    this.startBattle();
  }

  /**
   * Función para validar el comienzo del combate
   * @returns
   */
  startBattle() {
    this.log = [];
    if (!this.selectedGrumpi) {
      this.updateLog(
        'Por favor, selecciona un Grumpi para comenzar el combate.'
      );
      return;
    }

    this.playerTurn = Math.random() < 0.5;
    this.updateLog(
      this.playerTurn
        ? `¡Comienza el combate ${this.username}!`
        : '¡Comienza el oponente!'
    );

    if (!this.playerTurn) {
      this.opponentAttack();
    }
  }

  /**
   * Función para seleccionar el ataque que marca el entrenador.
   */
  playerAttack(atk: any) {
    if (this.playerTurn && this.selectedGrumpi && this.randomGrumpi) {
      this.randomGrumpi.PS -= atk.efecto;
      this.updateLog(
        `Tu ${this.selectedGrumpi.nombre} usó ${atk.nombre}, causando ${atk.efecto} de daño.`
      );
      this.checkBattleStatus();
    }
  }

  /**
   * Función para elegir aleatoriamente el ataque del Grumpi enemigo
   */
  opponentAttack() {
    if (!this.playerTurn && this.selectedGrumpi && this.randomGrumpi) {
      const randomAttack =
        this.randomGrumpi.ataques[
          Math.floor(Math.random() * this.randomGrumpi.ataques.length)
        ];
      this.selectedGrumpi.PS -= randomAttack.efecto;
      this.updateLog(
        `El ${this.randomGrumpi.nombre} usó ${randomAttack.nombre}, causando ${randomAttack.efecto} de daño.`
      );
      this.checkBattleStatus();
    }
  }

  /**
   * Función para obtener el estado del combate
   */
  checkBattleStatus() {
    if (this.randomGrumpi.PS <= 0) {
      this.updateLog(`¡Tu Grumpi ganó el combate!`);
      this.endBattle(true);
    } else if (this.selectedGrumpi.PS <= 0) {
      this.updateLog(`Tu Grumpi fue derrotado. El oponente ganó el combate.`);
      this.endBattle(false);
    } else {
      this.playerTurn = !this.playerTurn;
      if (!this.playerTurn) {
        setTimeout(() => this.opponentAttack(), 1000);
      }
    }
  }

  /**
   * Función para señalar el final del combate
   * @param playerWon
   */
  endBattle(playerWon: boolean) {
    this.playerTurn = false;
    this.playerWon = playerWon;
    this.battleFinished = true;
    this.resultMessage = playerWon
      ? '¡Has ganado el combate!'
      : 'Has perdido el combate.';
    this.updateLog(this.resultMessage);
  }

  /**
   * Función para actualizar el mensaje de estado del combate
   * @param message
   */
  updateLog(message: string) {
    this.log.push(message);
    setTimeout(() => {
      this.logContainer.nativeElement.scrollTop =
        this.logContainer.nativeElement.scrollHeight;
    }, 0);
  }

  /**
   * Función para resetear el combate
   */
  resetBattle() {
    this.battleFinished = false;
    this.log = [];
    this.loadGrumpis();
  }

  /**
   * Función para manejar la música durante el combate
   */
  toggleMusic() {
    this.pause_music = !this.pause_music;
    if (this.pause_music) {
      this.audio.pause();
    } else {
      this.audio.play().catch((error) => {
        console.log('Error al reproducir la música:', error);
      });
      console.log('Música reproduciéndose');
    }
  }

  ngOnDestroy(): void {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
  }
}

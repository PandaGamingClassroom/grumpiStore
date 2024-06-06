import { Component } from '@angular/core';
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
  styleUrl: './battle-game.component.scss',
})
export class BattleGameComponent {
  log: string[] = [];
  grumpiList: any;
  username: string | null = '';
  trainer: any;

  constructor(
    private grumpiService: GrumpiService,
    private trainersService: TrainerService
  ) {}

  ngOnInit() {
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


  attack(attacker: Grumpi, defender: Grumpi, move: Attacks) {}
}

import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { AvatarService } from '../services/avatar/avatar.service';
import { TrainerService } from '../services/trainers/trainer.service';
import { GrumpiService } from '../services/grumpi/grumpi.service';
import { FooterComponent } from '../footer/footer.component';
import { Avatars, lista_avatares } from '../../models/avatars';
import { BattleGameComponent } from '../battle-game/battle-game.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    NavBarComponent,
    CommonModule,
    FooterComponent,
    BattleGameComponent,
  ],
  providers: [GrumpiService, TrainerService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  avatar_list: Avatars[] = lista_avatares;
  avatarSelect = '';
  username: string | null = '';
  trainerList: any[] = [];
  trainer: any;
  trainerName: string = '';
  errorMessage: string = '';
  getError: boolean = false;
  grumpidolar: string = '';
  combatMarks: number = 0;

  constructor(
    private avatarService: AvatarService,
    private trainersService: TrainerService
  ) {}

  ngOnInit(): void {
    this.avatarService.loadAvatarFromStorage();
    this.avatarService.avatar$.subscribe((avatar) => {
      this.avatarSelect = avatar;
    });
    if (typeof window !== 'undefined') {
      // Verifica si `window` está definido
      this.username = localStorage.getItem('username');
      if (this.username) {
        this.getTrainerData(this.username);
      }
    }
  }

  avatarSelected(avatar: any) {
    this.avatarService.setAvatar(avatar.imagen);
  }

  loadAvatarFromStorage() {
    if (typeof localStorage !== 'undefined') {
      // Acceder a localStorage aquí
      const avatar = localStorage.getItem('avatar');
      if (avatar) {
        this.avatarService.setAvatar(avatar); // Utiliza el servicio para establecer el avatar
      }
    } else {
      console.error('localStorage is not supported in this environment.');
    }
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
          this.combatMarks = this.trainer.data.marca_combate;
          console.log('Datos del entrenador: ', this.trainer.data);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  getCombatMarksArray(): number[] {
    const combatMarksArray: number[] = [];
    for (let i = 0; i < this.combatMarks; i++) {
      combatMarksArray.push(i);
    }
    return combatMarksArray;
  }
}

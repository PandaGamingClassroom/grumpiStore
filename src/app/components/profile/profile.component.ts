import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { AvatarService } from '../services/avatar/avatar.service';
import { TrainerService } from '../services/trainers/trainer.service';
import { GrumpiService } from '../services/grumpi/grumpi.service';
import { FooterComponent } from '../footer/footer.component';
import { Avatars, lista_avatares } from '../../models/avatars';
import { BattleGameComponent } from '../battle-game/battle-game.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { iconEnergy } from '../../models/energies';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    NavBarComponent,
    CommonModule,
    FooterComponent,
    BattleGameComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [GrumpiService, TrainerService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
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
  avatar: any;
  iconListEnergy = iconEnergy;

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

  /** Variables para la imagen que sube el entrenador */
  isTypeSelected: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private avatarService: AvatarService,
    private trainersService: TrainerService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

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
    this.myForm = this.formBuilder.group({
      imagen: ['', Validators.required],
    });
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  avatarSelected(avatar: any) {
    this.avatarService.setAvatar(avatar.imagen);
  }

  onFileSelected(event: any) {
    const selectedType = event.target.value;
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }

    if (selectedType) {
      this.isTypeSelected = true;
    }
  }

  loadAvatarFromStorage() {
    if (typeof localStorage !== 'undefined') {
      // Acceder a localStorage aquí
      const avatar = localStorage.getItem('avatar');
      if (avatar) {
        this.avatarService.setAvatar(avatar);
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
          this.avatar = this.trainer.avatar;
          this.grumpidolar = this.trainer.grumpidolar;
          this.combatMarks = this.trainer.marca_combate;
          this.getEnergies(this.trainer, this.trainer.energies.tipo);
          console.log('Datos del entrenador: ', this.trainer);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  /**
  * Función para obtener la información de las energías del entrenador
  *
  * @param trainerData Obtiene los datos del entrenador
  */
  getEnergies(trainerData: any, typeEnergy: string) {
    let energies = trainerData.energias;
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

  getCombatMarksArray(): number[] {
    const combatMarksArray: number[] = [];

    for (let i = 0; i < this.combatMarks; i++) {
      combatMarksArray.push(i);
    }
    return combatMarksArray;
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}

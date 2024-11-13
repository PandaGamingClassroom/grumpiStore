import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { AvatarService } from '../services/avatar/avatar.service';
import { TrainerService } from '../services/trainers/trainer.service';
import { GrumpiService } from '../services/grumpi/grumpi.service';
import { FooterComponent } from '../footer/footer.component';
import { BattleGameComponent } from '../battle-game/battle-game.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { iconEnergy } from '../../models/energies';
import { ConfirmModalComponentComponent } from '../../segments/confirm-modal-component/confirm-modal-component.component';
import { MatDialog } from '@angular/material/dialog';

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
  isImageLoaded: boolean = false;
  myForm: FormGroup = new FormGroup({});
  avatar_list: any[] = [];
  avatarSelect: any[] = [];
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

  trainer_id: any;

  constructor(
    private avatarService: AvatarService,
    private trainersService: TrainerService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.obtenerListaAvatares();
    if (typeof window !== 'undefined') {
      // Verifica si `window` está definido
      this.username = localStorage.getItem('username');
      this.trainer_id = localStorage.getItem('id_trainer');
      if (this.username && this.trainer_id) {
        this.getTrainerData(this.trainer_id);
      }
    }
    this.myForm = this.formBuilder.group({
      imagen: ['', Validators.required],
    });
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  obtenerListaAvatares() {
    this.trainersService.getAvatars().subscribe({
      next: (response) => {
        this.avatar_list = response.avatars_list;
      },
      error: (err) => {
        console.error('Error al obtener la lista de avatares:', err);
      },
    });
  }

  avatarSelected(avatar: any) {
    const trainerData = {
      avatar: avatar.imagen,
    };
    const user_id = this.trainer_id ?? '';

    // Actualiza el avatar localmente para que se muestre de inmediato
    this.avatarSelect = avatar.imagen;

    this.avatarService.setAvatar(avatar.imagen);
    this.trainersService
      .updateTrainer(user_id, trainerData)
      .subscribe((response) => {
        const dialogRef = this.dialog.open(ConfirmModalComponentComponent, {
          width: '400px',
          height: '300px',
          data: {
            title: '¡Correcto!',
            message: 'Se ha modificado el avatar correctamente.',
          },
        });
        dialogRef.afterClosed().subscribe(() => {
          // Elimina la recarga de página
          // window.location.reload()
        });
      });
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
  getTrainerData(id: number): void {
    this.trainersService.getTrainerById(id).subscribe(
      (data) => {
        if (data.success === false) {
          console.log(data.error);
        } else {
          this.trainer = data.data;
          this.avatar = this.trainer.avatar;
          this.grumpidolar = this.trainer.grumpidolar;
          this.combatMarks = this.trainer.marca_combate;
          this.avatarSelect = this.trainer.avatar;
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
    console.log(
      'Datos del entrenador para el recuento de medallas:',
      trainerData
    );

    let energies = trainerData.energies;
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

  onImageLoad(): void {
    this.isImageLoaded = true;
  }

  logOut() {
    sessionStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}

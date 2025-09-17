import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerService } from '../../services/trainers/trainer.service';
import { FormsModule } from '@angular/forms';
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';

interface Energia {
  tipo: string;
  cantidad: number;
}

interface Trainer {
  id: number;
  name: string;
  energies: Energia[];
  grumpis?: any[];
  medallas?: any[];
  distintivos_liga?: any[];
  recompensas?: any[];
  [key: string]: any; // otros campos dinámicos del backend
}

@Component({
  selector: 'app-dashboard-screen',
  standalone: true,
  imports: [CommonModule, FormsModule, NavBarAdminComponent],
  providers: [TrainerService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  trainers: Trainer[] = [];
  originalTrainers: Trainer[] = [];
  id_profesor: number | string | null = null;
  profesores: any[] = [];
  selectedObjectType: string = 'grumpis';

  // 🔹 Iconos de energías
  energyIcons = [
    { src: '../../../../assets/iconEnergies/Agua2.0.PNG', alt: 'Agua' },
    { src: '../../../../assets/iconEnergies/Fuego2.0.PNG', alt: 'Fuego' },
    { src: '../../../../assets/iconEnergies/Aire2.0.PNG', alt: 'Aire' },
    { src: '../../../../assets/iconEnergies/Luz2.0.PNG', alt: 'Luz' },
    { src: '../../../../assets/iconEnergies/Normal2.0.PNG', alt: 'Normal' },
    {
      src: '../../../../assets/iconEnergies/Oscuridad2.0.PNG',
      alt: 'Oscuridad',
    },
    { src: '../../../../assets/iconEnergies/Rayo2.0.PNG', alt: 'Rayo' },
    { src: '../../../../assets/iconEnergies/Tierra2.0.PNG', alt: 'Tierra' },
    { src: '../../../../assets/iconEnergies/Vida2.0.PNG', alt: 'Vida' },
  ];

  constructor(
    private trainerService: TrainerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit ejecutado');
    if (typeof window !== 'undefined') {
      this.id_profesor = localStorage.getItem('id_profesor');
      console.log('Id del profesor desde localStorage:', this.id_profesor);

      const idNum = Number(this.id_profesor);
      console.log('Id del profesor convertido a número:', idNum);

      // Llamar siempre a loadProfesores para depurar
      this.loadProfesores();

      // Solo si quieres cargar trainers individuales
      if (idNum) {
        this.loadTrainers(idNum);
      }
    }
  }

  // Cargar entrenadores de un profesor
  loadTrainers(id_profesor: number) {
    this.trainerService.getEntrenadoresByProfesorId(id_profesor).subscribe(
      (data: any) => {
        console.log('--- DEBUG ---');
        console.log('Valor de data recibido:', data);
        console.log('Tipo de data:', typeof data);
        console.log('Es array?', Array.isArray(data));
        console.log('Tiene data.trainers?', data?.trainers);

        // Asegurarnos de que siempre sea un array
        let trainersArray: any[] = [];
        if (Array.isArray(data)) {
          trainersArray = data;
        } else if (Array.isArray(data?.trainers)) {
          trainersArray = data.trainers;
        } else {
          console.warn(
            'Backend no devolvió un array válido. Se usará array vacío.'
          );
          trainersArray = [];
        }

        console.log('TrainersArray final que se mapeará:', trainersArray);

        this.trainers = trainersArray.map((trainer: any) => ({
          ...trainer,
          energies: Array.isArray(trainer.energies) ? trainer.energies : [],
        }));

        console.log('Trainers cargados:', this.trainers);
      },
      (error) => {
        console.error('Error al obtener los entrenadores:', error);
        this.trainers = [];
      }
    );
  }

  // Cargar profesores y sus entrenadores
  loadProfesores() {
    this.trainerService.getProfesores().subscribe((profes: any) => {
      // Tomar directamente el array de profesores
      this.profesores = profes.profesoresList || [];

      // Cargar entrenadores de cada profesor
      this.profesores.forEach((prof) => {
        this.trainerService
          .getEntrenadoresByProfesorId(prof.id)
          .subscribe((entrenadores) => {
            prof.entrenadores = entrenadores || [];
          });
      });

      console.log('Profesores finales cargados:', this.profesores);
    });
  }

  // Renderización eficiente en *ngFor
  trackById(index: number, item: any): string {
    return item.id?.toString() ?? index.toString();
  }

  // Modificación de energías
  incrementEnergy(trainer: Trainer, tipo: string) {
    trainer.energies = trainer.energies.map((e) =>
      e.tipo === tipo ? { ...e, cantidad: e.cantidad + 1 } : e
    );
  }

  decrementEnergy(trainer: Trainer, tipo: string) {
    trainer.energies = trainer.energies.map((e) =>
      e.tipo === tipo ? { ...e, cantidad: Math.max(0, e.cantidad - 1) } : e
    );
  }

  updateEnergy(trainer: Trainer, tipo: string, event: any) {
    const value = Number(event.target.value);
    trainer.energies = trainer.energies.map((e) =>
      e.tipo === tipo ? { ...e, cantidad: value >= 0 ? value : 0 } : e
    );
  }

  // Guardar cambios de energías
  guardarCambios(): void {
    if (!this.trainers.length) return;

    this.trainers.forEach((trainer) => {
      this.trainerService
        .updateTrainer(trainer.id.toString(), { energies: trainer.energies })
        .subscribe({
          next: (res: any) =>
            console.log(`Energías de ${trainer.name} guardadas`, res),
          error: (err: any) =>
            console.error(`Error guardando ${trainer.name}`, err),
        });
    });

    this.originalTrainers = JSON.parse(JSON.stringify(this.trainers));
  }

  cancelarCambios() {
    this.trainers = JSON.parse(JSON.stringify(this.originalTrainers));
    console.log('Cambios cancelados, datos restaurados.');
  }

  // Asignar objetos a un entrenador
  assignObjectToTrainer(trainer: Trainer, objeto: any) {
    switch (this.selectedObjectType) {
      case 'grumpis':
        this.trainerService
          .assignCreatureToTrainer(trainer.id, objeto)
          .subscribe(() => this.loadTrainers(Number(this.id_profesor)));
        break;

      case 'medallas':
        this.trainerService
          .assignMedalToTrainer(trainer.name, objeto)
          .subscribe(() => this.loadTrainers(Number(this.id_profesor)));
        break;

      case 'distintivos':
        this.trainerService
          .assignBadgeToTrainers([trainer.name], objeto)
          .subscribe(() => this.loadTrainers(Number(this.id_profesor)));
        break;

      case 'recompensas':
        this.trainerService
          .assignReward(trainer.id, objeto)
          .subscribe(() => this.loadTrainers(Number(this.id_profesor)));
        break;
    }
  }

  // Abrir modal (placeholder por ahora)
  openAssignModal(trainer: Trainer) {
    // De momento pedimos el objeto en un prompt (o lo recibiremos desde un modal más adelante)
    const objeto = prompt(
      `Introduce el ${this.selectedObjectType} que quieres asignar a ${trainer.name}:`
    );

    if (objeto) {
      this.assignObjectToTrainer(trainer, { nombre: objeto });
    }
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

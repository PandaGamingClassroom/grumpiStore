// dashboard.component.ts
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
  [key: string]: any;
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
  profesor: any;
  selectedObjectType: string = 'grumpis';
  id_profesor: number | string | null = null;

  // 🔹 Para el modal
  selectedTrainer: Trainer | null = null;
  selectedObject: any = null;
  selectedTrainers: Trainer[] = [];

  // 🔹 Ejemplo de objetos disponibles (puedes cargar desde servicio)
  grumpisDisponibles: any[] = [
    { nombre: 'Grumpi 1' },
    { nombre: 'Grumpi 2' },
    { nombre: 'Grumpi 3' },
  ];

  constructor(
    private trainerService: TrainerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id_profesor = localStorage.getItem('id_profesor');
    console.log('id_profesor desde localStorage:', this.id_profesor);

    if (this.id_profesor) {
      this.loadProfesor(this.id_profesor);
    }
  }

  loadProfesor(id: any) {
    this.trainerService.getProfesor(id).subscribe((profesor: any) => {
      this.profesor = profesor;
      this.cargarEntrenadoresProfesor(this.profesor.id);
    });
  }

  cargarEntrenadoresProfesor(id_profesor: any) {
    this.trainerService.getEntrenadoresByProfesorId(id_profesor).subscribe(
      (res: any) => {
        console.log('Respuesta cruda entrenadores:', res);

        let entrenadores: any[] = [];
        if (Array.isArray(res)) {
          entrenadores = res;
        } else if (Array.isArray(res?.data)) {
          entrenadores = res.data;
        } else {
          console.warn('El backend no devolvió un array válido:', res);
        }

        this.trainers = entrenadores.map((t: any) => ({
          ...t,
          energies: Array.isArray(t.energies) ? t.energies : [],
          grumpis: Array.isArray(t.grumpis) ? t.grumpis : [],
          medallas: Array.isArray(t.medallas) ? t.medallas : [],
          distintivos_liga: Array.isArray(t.distintivos_liga)
            ? t.distintivos_liga
            : [],
          recompensas: Array.isArray(t.recompensas) ? t.recompensas : [],
        }));

        console.log('Entrenadores normalizados:', this.trainers);
      },
      (err) => console.error('Error cargando entrenadores:', err)
    );
  }

  trackById(index: number, item: any): string {
    return item.id?.toString() ?? index.toString();
  }

  // Marcar/desmarcar entrenador
  toggleTrainerSelection(trainer: Trainer, event: any) {
    if (event.target.checked) {
      this.selectedTrainers.push(trainer);
    } else {
      this.selectedTrainers = this.selectedTrainers.filter(
        (t) => t.id !== trainer.id
      );
    }
  }

  openAssignModal(trainer: Trainer) {
    this.selectedTrainer = trainer;
    this.selectedObject = null; // reset

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('assignModal')
    );
    modal.show();
  }

  assignObjectToTrainer(object: any) {
    if (!this.selectedTrainer || !object) return;

    // Llamar al servicio según el tipo
    switch (this.selectedObjectType) {
      case 'grumpis':
        this.trainerService
          .assignCreatureToTrainer(this.selectedTrainer.id, object)
          .subscribe(() => this.refreshTrainers());
        break;
      case 'medallas':
        this.trainerService
          .assignMedalToTrainer(this.selectedTrainer.name, object)
          .subscribe(() => this.refreshTrainers());
        break;
      case 'distintivos':
        this.trainerService
          .assignBadgeToTrainers([this.selectedTrainer.name], object)
          .subscribe(() => this.refreshTrainers());
        break;
      case 'recompensas':
        this.trainerService
          .assignReward(this.selectedTrainer.id, object)
          .subscribe(() => this.refreshTrainers());
        break;
    }
  }

  // Asignar objeto a todos los entrenadores seleccionados
  assignObjectToSelectedTrainers(object: any) {
    if (!object || !this.selectedTrainers.length) return;

    this.selectedTrainers.forEach((trainer) => {
      switch (this.selectedObjectType) {
        case 'grumpis':
          this.trainerService
            .assignCreatureToTrainer(trainer.id, object)
            .subscribe(() => this.refreshTrainers());
          break;
        case 'medallas':
          this.trainerService
            .assignMedalToTrainer(trainer.name, object)
            .subscribe(() => this.refreshTrainers());
          break;
        case 'distintivos':
          this.trainerService
            .assignBadgeToTrainers([trainer.name], object)
            .subscribe(() => this.refreshTrainers());
          break;
        case 'recompensas':
          this.trainerService
            .assignReward(trainer.id, object)
            .subscribe(() => this.refreshTrainers());
          break;
      }
    });

    // Limpiar selección después
    this.selectedTrainers = [];
  }

  refreshTrainers() {
    if (this.profesor?.id) {
      this.cargarEntrenadoresProfesor(this.profesor.id);
    }
  }
}

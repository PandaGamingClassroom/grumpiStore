import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrainerService } from '../../services/trainers/trainer.service';
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
  grumpidolar?: any[];
  medallas?: any[];
  distintivos_liga?: any[];
  objetos_combate?: any[];
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
  id_profesor: number | null = null;

  selectedTrainer: Trainer | null = null;
  selectedObject: any = null;
  selectedTrainers: Trainer[] = [];

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
    const id = localStorage.getItem('id_profesor');
    this.id_profesor = id ? Number(id) : null;
    if (this.id_profesor) this.loadProfesor(this.id_profesor);
  }

  loadProfesor(id: number) {
    this.trainerService.getProfesor(id).subscribe((profesor) => {
      this.profesor = profesor;
      this.cargarEntrenadoresProfesor(this.profesor.id);
    });
  }

  cargarEntrenadoresProfesor(id_profesor: number) {
    this.trainerService.getEntrenadoresByProfesorId(id_profesor).subscribe({
      next: (res: any) => {
        this.trainers = res.map((t: any) => ({
          ...t,
          energies: Array.isArray(t.energies) ? t.energies : [],
          grumpis: Array.isArray(t.grumpis) ? t.grumpis : [],
          grumpidolar: Array.isArray(t.grumpidolar) ? t.grumpidolar : [],
          medallas: Array.isArray(t.medallas) ? t.medallas : [],
          distintivos_liga: Array.isArray(t.distintivos_liga)
            ? t.distintivos_liga
            : [],
          recompensas: Array.isArray(t.recompensas) ? t.recompensas : [],
          objetos_combate: Array.isArray(t.objetos_combate)
            ? t.objetos_combate
            : [],
        }));
      },
      error: (err) => console.error('Error cargando entrenadores:', err),
    });
  }

  trackById(index: number, item: any): string {
    return item.id?.toString() ?? index.toString();
  }

  toggleTrainerSelection(trainer: Trainer, event: any) {
    if (event.target.checked) this.selectedTrainers.push(trainer);
    else
      this.selectedTrainers = this.selectedTrainers.filter(
        (t) => t.id !== trainer.id
      );
  }

  openAssignModal(trainer: Trainer) {
    this.selectedTrainer = trainer;
    this.selectedObject = null;
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('assignModal')
    );
    modal.show();
  }

  assignObjectToTrainer(object: any) {
    if (!this.selectedTrainer || !object) return;
    this.assignObject([this.selectedTrainer], object);
  }

  assignObjectToSelectedTrainers(object: any) {
    if (!object || !this.selectedTrainers.length) return;
    this.assignObject(this.selectedTrainers, object);
    this.selectedTrainers = [];
  }

  private assignObject(trainers: Trainer[], object: any) {
    const listKey = this.getListKeyByObjectType(this.selectedObjectType);
    const validTrainers: Trainer[] = [];
    let alreadyHasObject = false;

    trainers.forEach((trainer) => {
      const list = trainer[listKey] || [];
      const exists = list.some((item: any) => item.nombre === object.nombre);
      if (exists) alreadyHasObject = true;
      else validTrainers.push(trainer);
    });

    if (alreadyHasObject) {
      alert(
        'Uno o más entrenadores ya tienen este objeto. No se asignará duplicado.'
      );
    }
    if (!validTrainers.length) return;

    const trainerIds = validTrainers.map((t) => t.id);
    this.trainerService
      .assignObjectToTrainers(trainerIds, object, this.selectedObjectType)
      .subscribe(() => this.refreshTrainers());
  }

  private getListKeyByObjectType(type: string): string {
    return (
      {
        grumpis: 'grumpis',
        grumpidolares: 'grumpidolar',
        medallas: 'medallas',
        distintivos: 'distintivos_liga',
        recompensas: 'recompensas',
        energias: 'energies',
        objetos_combate: 'objetos_combate',
      }[type] ?? ''
    );
  }

  refreshTrainers() {
    if (this.profesor?.id) this.cargarEntrenadoresProfesor(this.profesor.id);
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrainerService } from '../../services/trainers/trainer.service';
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { GrumpiService } from '../../services/grumpi/grumpi.service';

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
  providers: [TrainerService, GrumpiService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  trainers: Trainer[] = [];
  profesor: any;
  id_profesor: number | null = null;

  selectedTrainer: Trainer | null = null;
  selectedObject: any = null;
  selectedTrainers: Trainer[] = [];
  modalObjectType: string = '';

  // Mock de disponibles (ideal: pedir al backend)
  grumpisDisponibles: any[] = [];
  medallasDisponibles: any[] = [];
  distintivosDisponibles: any[] = [
    { nombre: 'Distintivo Oro' },
    { nombre: 'Distintivo Plata' },
  ];
  recompensasDisponibles: any[] = [
    { nombre: 'Recompensa XP' },
    { nombre: 'Recompensa Objeto' },
  ];
  objetosCombateDisponibles: any[] = [
    { nombre: 'Poción' },
    { nombre: 'Revivir' },
  ];
  energiasDisponibles: any[] = [
    { tipo: 'Agua', cantidad: 1 },
    { tipo: 'Fuego', cantidad: 1 },
  ];

  constructor(
    private trainerService: TrainerService,
    private cdr: ChangeDetectorRef,
    private grumpiService: GrumpiService
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

  /**
   * Función para obtener la lista de Grumpis disponibles
   */
  loadGrumpis() {
    this.grumpiService.getGrumpis().subscribe(
      (response) => {
        this.grumpisDisponibles = response.grumpis_list;
        console.log('Grumpis: ', this.grumpisDisponibles);
      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
  }

  /**
   * Función para obtener la lista de medallas disponibles
   */
  loadmedalsImages() {
    this.grumpiService.getImageMedals().subscribe(
      (response) => {
        this.medallasDisponibles = response.medals_list;
        console.log('URL: ', this.medallasDisponibles);
      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
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

  // Abrir modal para asignar a un entrenador
  openAssignModal(trainer: Trainer, type: string) {
    this.selectedTrainer = trainer;
    this.selectedObject = null;
    this.modalObjectType = type;
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('assignModal')
    );
    modal.show();
  }

  // Abrir modal para asignar a seleccionados
  openAssignModalToSelected(type: string) {
    this.selectedTrainer = null;
    this.selectedObject = null;
    this.modalObjectType = type;
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('assignModal')
    );
    modal.show();
  }

  // Asignar
  assignObjectToTrainer(object: any, type: string) {
    if (this.selectedTrainer) {
      this.assignObject([this.selectedTrainer], object, type);
    } else if (this.selectedTrainers.length) {
      this.assignObject(this.selectedTrainers, object, type);
      this.selectedTrainers = [];
    }
  }

  // Eliminar
  removeObjectFromTrainer(trainer: Trainer, object: any, type: string) {
    const listKey = this.getListKeyByObjectType(type);
    trainer[listKey] = trainer[listKey].filter(
      (item: any) => item.nombre !== object.nombre && item.tipo !== object.tipo
    );

    const objetosAEliminar = [
      {
        trainerId: trainer.id,
        type,
        object,
      },
    ];

    this.trainerService.deleteObjectsFromTrainer(objetosAEliminar).subscribe(
      (res) => console.log('Objetos eliminados:', res),
      (error) => console.error('Error al eliminar objetos:', error)
    );
  }

  // Asignación genérica
  private assignObject(trainers: Trainer[], object: any, type: string) {
    const listKey = this.getListKeyByObjectType(type);
    const validTrainers: Trainer[] = [];
    let alreadyHasObject = false;

    trainers.forEach((trainer) => {
      const list = trainer[listKey] || [];
      const exists = list.some(
        (item: any) =>
          item.nombre === object.nombre || item.tipo === object.tipo
      );
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
      .assignObjectToTrainers(trainerIds, object, type)
      .subscribe(() => {
        // ✅ Actualizar en memoria
        validTrainers.forEach((t) => {
          if (!Array.isArray(t[listKey])) t[listKey] = [];
          t[listKey].push({ ...object });
        });

        // 🔄 Si quieres también puedes refrescar desde backend
        // this.refreshTrainers();

        this.cdr.detectChanges(); // fuerza update en la vista
      });
  }

  private getListKeyByObjectType(type: string): string {
    return (
      {
        grumpis: 'grumpis',
        grumpidolar: 'grumpidolar',
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

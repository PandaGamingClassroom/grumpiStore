import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerService } from '../../services/trainers/trainer.service';
import { Observable } from 'rxjs';

interface Energia {
  tipo: string;
  cantidad: number;
}

interface Trainer {
  id: number | string;
  name: string;
  energies: Energia[];
  [key: string]: any; // Para otros campos dinámicos del backend
}

@Component({
  selector: 'app-dashboard-screen',
  standalone: true,
  imports: [CommonModule],
  providers: [TrainerService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  trainers: Trainer[] = [];
  originalTrainers: Trainer[] = [];
  id_profesor: number | string | null = null;

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
    if (typeof window !== 'undefined') {
      this.id_profesor = localStorage.getItem('id_profesor');
      if (this.id_profesor) this.loadTrainers(Number(this.id_profesor));
    }
  }

  private loadTrainers(profesorId: number) {
    this.trainerService.getEntrenadoresByProfesorId(profesorId).subscribe({
      next: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
          this.trainers = res.data.map((trainer: any, idx: number) => ({
            ...trainer,
            id: trainer.id ?? `trainer-${idx}`,
            energies: Array.isArray(trainer.energies)
              ? trainer.energies
              : Object.entries(trainer.energies || {}).map(
                  ([tipo, cantidad]) => ({ tipo, cantidad })
                ),
          }));
          // Creamos copia para cancelar cambios
          this.originalTrainers = JSON.parse(JSON.stringify(this.trainers));
          this.cdr.detectChanges();
          console.log('Entrenadores cargados:', this.trainers);
        } else {
          this.trainers = [];
        }
      },
      error: (err) => {
        console.error('Error obteniendo entrenadores:', err);
        this.trainers = [];
      },
    });
  }

  trackById(index: number, item: any): string {
    return item.id?.toString() ?? index.toString();
  }

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

    // Actualizamos copia original
    this.originalTrainers = JSON.parse(JSON.stringify(this.trainers));
  }

  cancelarCambios() {
    this.trainers = JSON.parse(JSON.stringify(this.originalTrainers));
    console.log('Cambios cancelados, datos restaurados.');
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

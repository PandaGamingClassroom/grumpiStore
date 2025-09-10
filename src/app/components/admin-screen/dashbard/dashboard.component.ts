import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerService } from '../../services/trainers/trainer.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard-screen',
  standalone: true,
  imports: [CommonModule],
  providers: [TrainerService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  trainers: any[] = [];
  nameProfesor: any;
  username: any;
  lastNameProfesor: any;
  profesor: any;
  id_profesor: any;
  constructor(
    private trainersService: TrainerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.id_profesor = localStorage.getItem('id_profesor');
      this.getTrainers(this.id_profesor);
    }
  }

  // Obtiene la lista de entrenadores asignados al profesor
  getTrainers(profesorId: number) {
    this.trainersService.getEntrenadoresByProfesorId(profesorId).subscribe(
      (data) => {
        this.trainers = data.data.map((trainer: any) => ({
          ...trainer,
          energies: Object.entries(trainer.energies).map(
            ([tipo, cantidad]) => ({
              tipo,
              cantidad,
            })
          ),
        }));
        console.log('Entrenadores: ', this.trainers);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  incrementEnergy(alumnoId: number, tipo: string) {
    const alumno = this.trainers.find((a) => a.id === alumnoId);
    if (alumno) {
      const energia = alumno.energies.find((e: any) => e.tipo === tipo);
      if (energia) energia.cantidad++;
    }
  }

  decrementEnergy(alumnoId: number, tipo: string) {
    const alumno = this.trainers.find((a) => a.id === alumnoId);
    if (alumno) {
      const energia = alumno.energies.find((e: any) => e.tipo === tipo);
      if (energia && energia.cantidad > 0) energia.cantidad--;
    }
  }

  updateEnergy(alumnoId: number, tipo: string, event: any) {
    const value = Number(event.target.value);
    const alumno = this.trainers.find((a) => a.id === alumnoId);
    if (alumno) {
      const energia = alumno.energies.find((e: any) => e.tipo === tipo);
      if (energia) energia.cantidad = value > 0 ? value : 0;
    }
  }

  guardarCambios() {
    console.log('Guardar cambios:', this.trainers);

    this.trainers.forEach((trainer) => {
      this.trainersService
        .updateTrainer(trainer.id, { energies: trainer.energies })
        .subscribe(
          (res) => console.log(`Energías de ${trainer.name} guardadas`, res),
          (err) => console.error(`Error guardando ${trainer.name}`, err)
        );
    });
  }

  cancelarCambios() {
    if (this.id_profesor) {
      this.getTrainers(this.id_profesor); // volvemos a cargar los datos originales del servidor
      console.log('Cambios cancelados, datos restaurados.');
    }
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

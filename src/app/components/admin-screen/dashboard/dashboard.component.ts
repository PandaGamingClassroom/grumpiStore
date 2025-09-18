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
  profesores: any[] = [];
  selectedObjectType: string = 'grumpis';
  id_profesor: number | string | null = null;

  constructor(
    private trainerService: TrainerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id_profesor = localStorage.getItem('id_profesor');
    console.log('id_profesor desde localStorage:', this.id_profesor);

    // Cargar todos los profesores + sus entrenadores
    this.loadProfesores();
  }

  // Cargar profesores y sus entrenadores
  loadProfesores() {
    this.trainerService.getProfesores().subscribe((profes: any) => {
      // Normalizar la lista de profesores
      this.profesores = profes?.profesoresList || [];
      console.log('Profesores crudos:', profes);

      // Para cada profesor, cargar sus entrenadores
      this.profesores.forEach((prof) => {
        this.trainerService
          .getEntrenadoresByProfesorId(prof.id)
          .subscribe((res: any) => {
            console.log(`Entrenadores crudos de prof ${prof.id}:`, res);

            // Normalizar a array
            let entrenadoresArray: any[] = [];
            if (Array.isArray(res)) {
              entrenadoresArray = res;
            } else if (Array.isArray(res?.trainers)) {
              entrenadoresArray = res.trainers;
            } else {
              console.warn('El backend no devolvió un array válido:', res);
              entrenadoresArray = [];
            }

            // Mapear asegurando arrays en cada campo
            prof.entrenadores = entrenadoresArray.map((trainer: any) => ({
              ...trainer,
              energies: Array.isArray(trainer.energies) ? trainer.energies : [],
              grumpis: Array.isArray(trainer.grumpis) ? trainer.grumpis : [],
              medallas: Array.isArray(trainer.medallas) ? trainer.medallas : [],
              distintivos_liga: Array.isArray(trainer.distintivos_liga)
                ? trainer.distintivos_liga
                : [],
              recompensas: Array.isArray(trainer.recompensas)
                ? trainer.recompensas
                : [],
            }));

            this.cdr.detectChanges(); // forzar actualización en la vista
          });
      });

      this.cdr.detectChanges();
    });
  }

  trackById(index: number, item: any): string {
    return item.id?.toString() ?? index.toString();
  }
}

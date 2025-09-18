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

  constructor(
    private trainerService: TrainerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id_profesor = localStorage.getItem('id_profesor');
    console.log('id_profesor desde localStorage:', this.id_profesor);

    // Cargar todos los profesores + sus entrenadores
    this.loadProfesor(this.id_profesor);
  }

  /**
   * Función para obtener los datos del profesor que ha iniciado sesión.
   * @param id Id del profesor que ha iniciado
   */
  loadProfesor(id: any){
    this.trainerService.getProfesor(id).subscribe((profesor: any) => {
      this.profesor = profesor;
      this.cargarEntrenadoresProfesor(this.profesor.id);
    });
  }

  /**
   * Función para obtener los entrenadores del profesor que ha iniciado sesión.
   * @param id_profesor ID del profesor.
   */
  cargarEntrenadoresProfesor(id_profesor: any) {
    this.trainerService.getEntrenadoresByProfesorId(id_profesor).subscribe((entrenadores: any) => {
      console.log('Lista de entrenadores del profesor: ', entrenadores);
      this.trainers = entrenadores;
    });
  }

  trackById(index: number, item: any): string {
    return item.id?.toString() ?? index.toString();
  }
}

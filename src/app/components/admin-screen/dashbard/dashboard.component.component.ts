import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerService } from '../../services/trainers/trainer.service';

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

  constructor(private trainersService: TrainerService) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.username = localStorage.getItem('username');
      this.nameProfesor = localStorage.getItem('nameUser');
      this.getDadataProfesor(this.nameProfesor);
    }
  }

  getDadataProfesor(name: string) {
    this.trainersService.getProfesorByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message);
        } else {
          this.profesor = data;
          console.log('Profesor: ', this.profesor);
          this.lastNameProfesor = data.data.apellidos;
          this.getTrainers(data.data.id);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  // Obtiene la lista de entrenadores asignados al profesor
  getTrainers(profesorId: number) {
    this.trainersService.getEntrenadoresByProfesorId(profesorId).subscribe(
      (data) => {
        this.trainers = data;
        console.log('Entrenadores: ', data);

      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  incrementEnergy(alumnoId: number, tipo: string) {
    const alumno = this.trainers.find((a) => a.id === alumnoId);
    if (alumno) {
      const energia = alumno.energias.find((e: any) => e.tipo === tipo);
      if (energia) energia.cantidad++;
    }
  }

  decrementEnergy(alumnoId: number, tipo: string) {
    const alumno = this.trainers.find((a) => a.id === alumnoId);
    if (alumno) {
      const energia = alumno.energias.find((e: any) => e.tipo === tipo);
      if (energia && energia.cantidad > 0) energia.cantidad--;
    }
  }

  updateEnergy(alumnoId: number, tipo: string, event: any) {
    const value = Number(event.target.value);
    const alumno = this.trainers.find((a) => a.id === alumnoId);
    if (alumno) {
      const energia = alumno.energias.find((e: any) => e.tipo === tipo);
      if (energia) energia.cantidad = value > 0 ? value : 0;
    }
  }

  guardarCambios() {
    console.log('Guardar cambios:', this.trainers);
    // Aquí iría la lógica para guardar en el servidor
  }

  cancelarCambios() {
    console.log('Cambios cancelados');
    // Aquí iría la lógica para restaurar valores iniciales
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

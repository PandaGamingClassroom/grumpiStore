import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { FooterComponent } from '../../footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-screen',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  alumnos = [
    {
      id: 1,
      name: 'Lynx',
      energias: [
        { tipo: 'agua', cantidad: 10 },
        { tipo: 'fuego', cantidad: 8 },
        { tipo: 'sol', cantidad: 6 },
        { tipo: 'luna', cantidad: 7 },
        { tipo: 'sombra', cantidad: 5 },
        { tipo: 'rayo', cantidad: 9 },
        { tipo: 'hoja', cantidad: 4 },
        { tipo: 'roca', cantidad: 3 },
      ],
    },
    // Otros alumnos...
  ];

  constructor() {}

  ngOnInit() {}

  incrementEnergy(alumnoId: number, tipo: string) {
    const alumno = this.alumnos.find((a) => a.id === alumnoId);
    if (alumno) {
      const energia = alumno.energias.find((e) => e.tipo === tipo);
      if (energia) energia.cantidad++;
    }
  }

  decrementEnergy(alumnoId: number, tipo: string) {
    const alumno = this.alumnos.find((a) => a.id === alumnoId);
    if (alumno) {
      const energia = alumno.energias.find((e) => e.tipo === tipo);
      if (energia && energia.cantidad > 0) energia.cantidad--;
    }
  }

  updateEnergy(alumnoId: number, tipo: string, event: any) {
    const value = Number(event.target.value);
    const alumno = this.alumnos.find((a) => a.id === alumnoId);
    if (alumno) {
      const energia = alumno.energias.find((e) => e.tipo === tipo);
      if (energia) energia.cantidad = value > 0 ? value : 0;
    }
  }

  guardarCambios() {
    console.log('Guardar cambios:', this.alumnos);
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

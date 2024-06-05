import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../services/trainers/trainer.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-medals-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  providers: [TrainerService],
  templateUrl: './medals-list.component.html',
  styleUrl: './medals-list.component.scss',
})
export class MedalsListComponent implements OnInit {
  /**
   * CANTIDADES DISPONIBLES DE LAS ENERGÍAS
   */
  cantidadEnergiaAgua: number = 0;
  cantidadEnergiaAire: number = 0;
  cantidadEnergiaLuz: number = 0;
  cantidadEnergiaTierra: number = 0;
  cantidadEnergiaFuego: number = 0;
  cantidadEnergiaVida: number = 0;
  cantidadEnergiaRayo: number = 0;
  cantidadEnergiaNormal: number = 0;
  cantidadEnergiaOscuridad: number = 0;
  cantidadTotal: number = 0;
  trainer: any;
  username: string | null = '';

  constructor(private trainersService: TrainerService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      // Verifica si `window` está definido
      this.username = localStorage.getItem('username');
      if (this.username) {
        this.getTrainerData(this.username);
      }
    }
  }

  getTrainerData(name: string): void {
    this.trainersService.getTrainerByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message); // Maneja el mensaje de "Entrenador no encontrado"
        } else {
          this.trainer = data;
          this.getEnergies(this.trainer, this.trainer.data.energias.tipo);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getEnergies(trainerData: any, typeEnergy: string) {
    let energies = trainerData.data.energias;
    for (let energia of energies) {
      if (energia.tipo == 'Agua') {
        this.cantidadEnergiaAgua++;
      } else if (energia.tipo == 'Fuego') {
        this.cantidadEnergiaFuego++;
      } else if (energia.tipo == 'Aire') {
        this.cantidadEnergiaAire++;
      } else if (energia.tipo == 'Luz') {
        this.cantidadEnergiaLuz++;
      } else if (energia.tipo == 'Normal') {
        this.cantidadEnergiaNormal++;
      } else if (energia.tipo == 'Oscuridad') {
        this.cantidadEnergiaOscuridad++;
      } else if (energia.tipo == 'Rayo') {
        this.cantidadEnergiaRayo++;
      } else if (energia.tipo == 'Tierra') {
        this.cantidadEnergiaTierra++;
      } else if (energia.tipo == 'Vida') {
        this.cantidadEnergiaVida++;
      }
    }
    this.cantidadTotal =
      this.cantidadEnergiaAgua +
      this.cantidadEnergiaFuego +
      this.cantidadEnergiaAire +
      this.cantidadEnergiaLuz +
      this.cantidadEnergiaNormal +
      this.cantidadEnergiaOscuridad +
      this.cantidadEnergiaRayo +
      this.cantidadEnergiaTierra +
      this.cantidadEnergiaVida;
  }
}

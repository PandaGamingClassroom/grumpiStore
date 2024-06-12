import { Component, OnInit } from '@angular/core';
import { Pet } from '../../models/virtualPet';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-virtual-pet',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './virtual-pet.component.html',
  styleUrls: ['./virtual-pet.component.scss'],
})
export class VirtualPetComponent implements OnInit {
  pet: Pet;
  petPixels: boolean[][];
  moveTimer: any;

  constructor() {
    this.pet = new Pet();
    this.petPixels = this.generatePetPixels();
  }

  ngOnInit(): void {
    this.startPetStatusDecrement();
    this.startMovingPet();
  }

  feedPet(): void {
    if (this.pet.isAlive) {
      this.pet.hunger = Math.min(this.pet.hunger + 20, 100);
    }
  }

  playWithPet(): void {
    if (this.pet.isAlive) {
      this.pet.happiness = Math.min(this.pet.happiness + 20, 100);
    }
  }

  cleanPet(): void {
    if (this.pet.isAlive) {
      this.pet.cleanliness = Math.min(this.pet.cleanliness + 20, 100);
    }
  }

  startPetStatusDecrement(): void {
    setInterval(() => {
      if (this.pet.isAlive) {
        this.pet.hunger = Math.max(this.pet.hunger - 1, 0);
        this.pet.happiness = Math.max(this.pet.happiness - 1, 0);
        this.pet.cleanliness = Math.max(this.pet.cleanliness - 1, 0);

        if (
          this.pet.hunger === 0 ||
          this.pet.happiness === 0 ||
          this.pet.cleanliness === 0
        ) {
          this.pet.isAlive = false;
        }
      }
    }, 10000); // Decrementa los valores cada segundo
  }

  generatePetPixels(): boolean[][] {
    // Representación de la mascota utilizando una cuadrícula de píxeles
    return [
      [false, false, true, true, true, true, true, true, false, false],
      [false, true, true, true, true, true, true, true, true, false],
      [true, true, false, true, true, true, true, false, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [true, false, true, true, true, true, true, true, false, true],
      [false, true, true, false, false, false, false, true, true, false],
      [false, true, false, true, true, true, true, false, true, false],
      [false, false, true, true, false, false, true, true, false, false],
    ];
  }

  movePet(): void {
    this.petPixels.forEach((row, rowIndex) => {
      row.forEach((pixel, colIndex) => {
        if (pixel) {
          this.petPixels[rowIndex][colIndex] = true; // Mantener el píxel activo
          setTimeout(() => {
            this.petPixels[rowIndex][colIndex] = false; // Desactivar el píxel después de un tiempo
          }, 300); // Retraso para desactivar el píxel después de 300 milisegundos
        }
      });
    });
  }

  startMovingPet(): void {
    this.moveTimer = setInterval(() => {
      this.movePet(); // Llamar a movePet automáticamente cada cierto tiempo
    }, 5000); // Intervalo de 5 segundos (puedes ajustarlo según tus necesidades)
  }
}

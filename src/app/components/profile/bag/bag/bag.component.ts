import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../../nav-bar/nav-bar.component';
import { Grumpi, grumpis } from '../../../../models/grumpi';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TrainerService } from '../../../services/trainers/trainer.service';

@Component({
  selector: 'app-bag',
  standalone: true,
  imports: [
    RouterLink,
    NavBarComponent,
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  providers: [TrainerService],
  templateUrl: './bag.component.html',
  styleUrl: './bag.component.scss',
})
export class BagComponent implements OnInit {
  grumpis: Grumpi[] = grumpis;
  marcasCombate: any;
  username: string | null = '';
  trainer: any;
  errorMessage: string = '';

  constructor(private trainersService: TrainerService) {
    this.username = localStorage.getItem('username');
    if (this.username) {
      this.getTrainerData(this.username);
    }
  }
  ngOnInit(): void {}

  /**
   * Función para obtener información sobre el entrenador que ha iniciado sesión
   * @param name recibe el nombre del entrenador
   */
  getTrainerData(name: string): void {
    this.trainersService.getTrainerByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message); // Maneja el mensaje de "Entrenador no encontrado"
        } else {
          this.trainer = data;
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}

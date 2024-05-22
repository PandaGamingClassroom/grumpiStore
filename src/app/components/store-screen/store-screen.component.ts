import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MedalsStoreComponent } from './medals-store/medals-store.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { GrumpiService } from '../services/grumpi/grumpi.service';
import { TrainerService } from '../services/trainers/trainer.service';

@Component({
  selector: 'app-store-screen',
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
    MedalsStoreComponent,
    FooterComponent,
  ],
  providers: [GrumpiService, TrainerService],
  templateUrl: './store-screen.component.html',
  styleUrl: './store-screen.component.scss',
})
export class StoreScreenComponent implements OnInit {
  imageUrls: string[] = [];
  grumpidolar: string = '';
  trainer: any;
  username: string | null = '';

  constructor(
    private grumpiService: GrumpiService,
    private http: HttpClient,
    private trainersService: TrainerService
  ) {}

  ngOnInit(): void {
    this.loadImageUrls();
    this.username = localStorage.getItem('username');
    if (this.username) {
      this.getTrainerData(this.username);
    }
  }

  loadImageUrls() {
    this.grumpiService.getCombatObjects().subscribe(
      (response) => {
        this.imageUrls = response.imageUrls;
      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
  }

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
          this.grumpidolar = this.trainer.data.grumpidolar;
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}

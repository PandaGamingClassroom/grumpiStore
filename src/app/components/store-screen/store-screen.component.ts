import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MedalsStoreComponent } from './medals-store/medals-store.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GrumpiService } from '../services/grumpi/grumpi.service';
import { TrainerService } from '../services/trainers/trainer.service';
import { ErrorLoginModalComponentComponent } from '../../segments/error-login-modal-component/error-login-modal-component.component';
import { subscribe } from 'diagnostics_channel';
import { ConfirmModalComponentComponent } from '../../segments/confirm-modal-component/confirm-modal-component.component';

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
  imageUrls: any;
  grumpidolar: string = '';
  trainer: any;
  username: string | null = '';
  selectedObject: any | null = null;
  errorTitle: string = '¡Imposible realizar la compra!';
  errorMessage: string = 'No dispones de suficientes Grumpidólares.';
  confirmTitle: string = 'Compra realizada';
  confirmMessage: string = 'La compra ha sido realizada correctammente.';

  constructor(
    private grumpiService: GrumpiService,
    private http: HttpClient,
    private trainersService: TrainerService,
    private dialog: MatDialog
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
        this.imageUrls = response.objectsList;
        console.log('Objetos: ', this.imageUrls);
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

  /**
   * Función para comprar el objeto seleccionado.
   *
   * Se tiene en cuenta el precio en grumpidólares del objeto
   * y los grumpiólares disponibles por el entrenador
   *
   * @param grumpidolarTrainer Grumpidólares disponibles por el entrenador.
   * @param price Precio del objeto seleccionado.
   */
  buyCombatObjects() {
    let grumpidolarTrainer: any = this.grumpidolar;
    let price = this.selectedObject.precio;
    let finalCount: number = 0;
    let trainerName = this.trainer.data.name;
    if (price > grumpidolarTrainer) {
      this.openErrorModal();
    } else {
      finalCount = grumpidolarTrainer - price;
      console.log('Grumpidolares finales para el entrenador: ', finalCount);
      this.trainersService
        .assignGrumpidolaresAfterBuyToTrainer(trainerName, finalCount)
        .subscribe(
          (response) => {
            this.openConfirmModal();
          },
          (error) => {
            console.error('Error:', error);
          }
        );
    }
  }

  /**
   * Función para invocar a la ventana modal de error.
   */
  openErrorModal() {
    const data = {
      title: this.errorTitle,
      message: this.errorMessage,
    };

    this.dialog.open(ErrorLoginModalComponentComponent, {
      width: '400px',
      height: '300px',
      data: data,
    });
  }

  openConfirmModal() {
    const data = {
      title: this.confirmTitle,
      message: this.confirmMessage,
    };

    this.dialog.open(ConfirmModalComponentComponent, {
      width: '400px',
      height: '300px',
      data: data,
    });
  }
}

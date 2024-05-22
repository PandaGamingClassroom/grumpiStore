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
  providers: [GrumpiService],
  templateUrl: './store-screen.component.html',
  styleUrl: './store-screen.component.scss',
})
export class StoreScreenComponent implements OnInit {
  imageUrls: string[] = [];

  constructor(private grumpiService: GrumpiService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadImageUrls();
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
}

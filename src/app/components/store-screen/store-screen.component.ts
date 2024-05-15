import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MedalsStoreComponent } from './medals-store/medals-store.component';

@Component({
  selector: 'app-store-screen',
  standalone: true,
  imports: [RouterLink, NavBarComponent, MedalsStoreComponent],
  templateUrl: './store-screen.component.html',
  styleUrl: './store-screen.component.scss',
})
export class StoreScreenComponent {
  constructor() {
    console.log('Ventana Tienda Grumpi');
  }
}

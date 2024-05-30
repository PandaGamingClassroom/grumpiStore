import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';

@Component({
  selector: 'app-energies',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
  templateUrl: './energies.component.html',
  styleUrl: './energies.component.scss',
})
export class ObtainEnergies {}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';

@Component({
  selector: 'app-combats',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
  templateUrl: './combats.component.html',
  styleUrl: './combats.component.scss',
})
export class CombatsComponent {}

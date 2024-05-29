import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';

@Component({
  selector: 'app-rests',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
  templateUrl: './rests.component.html',
  styleUrl: './rests.component.scss',
})
export class RestsComponent {}

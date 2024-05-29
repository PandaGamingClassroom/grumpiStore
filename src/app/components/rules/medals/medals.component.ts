import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';

@Component({
  selector: 'app-medals',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
  templateUrl: './medals.component.html',
  styleUrl: './medals.component.scss',
})
export class MedalsComponent {}

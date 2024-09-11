import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.scss',
})
export class MapsComponent {
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

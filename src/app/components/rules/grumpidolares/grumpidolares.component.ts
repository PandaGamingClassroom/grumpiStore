import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';

@Component({
  selector: 'app-grumpidolares',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
  templateUrl: './grumpidolares.component.html',
  styleUrl: './grumpidolares.component.scss',
})
export class GrumpidolaresComponent {
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

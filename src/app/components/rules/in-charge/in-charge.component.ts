import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';

@Component({
  selector: 'app-in-charge',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
  templateUrl: './in-charge.component.html',
  styleUrl: './in-charge.component.scss',
})
export class InChargeComponent {
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

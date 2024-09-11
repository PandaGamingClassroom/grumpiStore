import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';

@Component({
  selector: 'app-medals-store',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
  templateUrl: './medals-store.component.html',
  styleUrl: './medals-store.component.scss'
})
export class MedalsStoreComponent {

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

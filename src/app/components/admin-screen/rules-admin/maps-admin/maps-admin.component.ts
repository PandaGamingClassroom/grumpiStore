import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [RouterLink, NavBarAdminComponent],
  templateUrl: './maps-admin.component.html',
  styleUrl: './maps-admin.component.scss',
})
export class MapsAdminComponent {
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';

@Component({
  selector: 'app-legend',
  standalone: true,
  imports: [RouterLink, NavBarAdminComponent],
  templateUrl: './legend-admin.component.html',
  styleUrl: './legend-admin.component.scss',
})
export class LegendAdminComponent {
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

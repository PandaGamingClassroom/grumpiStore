import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';

@Component({
  selector: 'app-energies',
  standalone: true,
  imports: [RouterLink, NavBarAdminComponent],
  templateUrl: './energies-admin.component.html',
  styleUrl: './energies-admin.component.scss',
})
export class ObtainEnergiesAdmin {
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

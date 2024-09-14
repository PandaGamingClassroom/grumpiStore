import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';

@Component({
  selector: 'app-medals-admin',
  standalone: true,
  imports: [RouterLink, NavBarAdminComponent],
  templateUrl: './medals-admin.component.html',
  styleUrl: './medals-admin.component.scss',
})
export class MedalsAdminComponent {
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

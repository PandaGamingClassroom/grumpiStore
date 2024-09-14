import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';

@Component({
  selector: 'app-grumpidolares',
  standalone: true,
  imports: [RouterLink, NavBarAdminComponent],
  templateUrl: './grumpidolares-admin.component.html',
  styleUrl: './grumpidolares-admin.component.scss',
})
export class GrumpidolaresAdminComponent {
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

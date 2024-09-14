import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';

@Component({
  selector: 'app-medals',
  standalone: true,
  imports: [RouterLink, NavBarAdminComponent],
  templateUrl: './medals.component.html',
  styleUrl: './medals.component.scss',
})
export class MedalsAdminComponent {
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

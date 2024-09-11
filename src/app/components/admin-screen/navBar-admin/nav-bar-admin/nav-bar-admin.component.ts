import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar-admin',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar-admin.component.html',
  styleUrl: './nav-bar-admin.component.scss'
})
export class NavBarAdminComponent {

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

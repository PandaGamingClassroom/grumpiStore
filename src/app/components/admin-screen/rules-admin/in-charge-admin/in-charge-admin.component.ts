import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';

@Component({
  selector: 'app-in-charge',
  standalone: true,
  imports: [RouterLink, NavBarAdminComponent],
  templateUrl: './in-charge-admin.component.html',
  styleUrl: './in-charge-admin.component.scss',
})
export class InChargeAdminComponent {
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

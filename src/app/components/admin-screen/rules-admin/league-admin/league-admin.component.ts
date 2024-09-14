import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';

@Component({
  selector: 'app-league',
  standalone: true,
  imports: [RouterLink, NavBarAdminComponent],
  templateUrl: './league-admin.component.html',
  styleUrl: './league-admin.component.scss',
})
export class LeagueAdminComponent {
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

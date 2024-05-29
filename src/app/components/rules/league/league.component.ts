import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';

@Component({
  selector: 'app-league',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
  templateUrl: './league.component.html',
  styleUrl: './league.component.scss',
})
export class LeagueComponent {}

import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-help-component',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
  templateUrl: './help-component.component.html',
  styleUrl: './help-component.component.scss',
})
export class HelpComponentComponent {}

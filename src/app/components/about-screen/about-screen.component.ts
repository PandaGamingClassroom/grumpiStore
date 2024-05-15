import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-about-screen',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
  templateUrl: './about-screen.component.html',
  styleUrl: './about-screen.component.scss'
})
export class AboutScreenComponent {

}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-about-screen',
  standalone: true,
  imports: [RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './about-screen.component.html',
  styleUrl: './about-screen.component.scss',
})
export class AboutScreenComponent {}

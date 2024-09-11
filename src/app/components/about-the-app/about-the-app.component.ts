import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-the-app',
  standalone: true,
  imports: [RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './about-the-app.component.html',
  styleUrl: './about-the-app.component.scss',
})
export class AboutTheAppComponent {
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

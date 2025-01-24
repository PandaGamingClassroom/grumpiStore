import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about-screen',
  standalone: true,
  imports: [RouterLink, NavBarComponent, TranslateModule],
  templateUrl: './about-screen.component.html',
  styleUrl: './about-screen.component.scss',
})
export class AboutScreenComponent {

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

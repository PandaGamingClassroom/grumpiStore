import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  email: string = 'gamificacionpanda@gmail.com';
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

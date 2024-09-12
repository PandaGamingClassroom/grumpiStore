import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-screen',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-screen.component.html',
  styleUrl: './blog-screen.component.scss',
})
export class BlogScreenComponent {

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

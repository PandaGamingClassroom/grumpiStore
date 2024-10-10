import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarWebComponent } from '../nav-bar-web/nav-bar-web.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-web-screen',
  standalone: true,
  imports: [RouterLink, NavBarWebComponent, FooterComponent],
  templateUrl: './web-screen.component.html',
  styleUrl: './web-screen.component.scss',
})
export class WebScreenComponent implements OnInit{

  constructor(){}
  ngOnInit(): void {

  }
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

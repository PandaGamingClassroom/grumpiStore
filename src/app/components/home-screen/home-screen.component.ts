import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss',
})
export class HomeScreenComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
  abrirLink(url: string) {
    window.open(url, '_blank');
  }
}

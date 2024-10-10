import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar-web',
  standalone: true,
  imports: [RouterLink],
  providers: [],
  templateUrl: './nav-bar-web.component.html',
  styleUrl: './nav-bar-web.component.scss',
})
export class NavBarWebComponent implements OnInit {


  constructor() {}

  ngOnInit(): void {

  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

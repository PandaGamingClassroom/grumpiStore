import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rests',
  standalone: true,
  imports: [RouterLink, NavBarComponent, CommonModule],
  templateUrl: './rests.component.html',
  styleUrl: './rests.component.scss',
})
export class RestsComponent implements OnInit {
  hideElements: boolean = false;
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.hideElements = params['hideElements'] === 'true';
    });
  }
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

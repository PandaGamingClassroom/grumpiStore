import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';

@Component({
  selector: 'app-intro-admin',
  standalone: true,
  imports: [CommonModule, NavBarAdminComponent, RouterModule],
  templateUrl: './intro-admin.component.html',
  styleUrls: ['./intro-admin.component.scss'],
})
export class IntroAdminComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

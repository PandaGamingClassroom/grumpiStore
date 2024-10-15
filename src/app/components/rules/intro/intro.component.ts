import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { NavBarAdminComponent } from '../../admin-screen/navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule, NavBarComponent, NavBarAdminComponent, RouterModule],
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';

@Component({
  selector: 'app-rests-admin',
  standalone: true,
  imports: [RouterLink, NavBarAdminComponent, CommonModule],
  templateUrl: './rests-admin.component.html',
  styleUrl: './rests-admin.component.scss',
})
export class RestsAdminComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {

  }
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

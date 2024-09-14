import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-rules-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, NavBarAdminComponent],
  templateUrl: './rules-admin.component.html',
  styleUrl: './rules-admin.component.scss',
})
export class RulesAdminComponent implements OnInit {
  isClicked: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  handleClick(): void {
    this.isClicked = !this.isClicked;
  }
}

import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';
@Component({
  selector: 'app-career',
  standalone: true,
  imports: [NavBarAdminComponent, RouterModule],
  templateUrl: './career-admin.component.html',
  styleUrls: ['./career-admin.component.scss'],
})
export class CareerAdminComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}

  // Deshabilitar clic derecho (si es necesario)
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

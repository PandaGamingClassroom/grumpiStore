import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavBarAdminComponent } from './navBar-admin/nav-bar-admin/nav-bar-admin.component';

@Component({
  selector: 'app-admin-screen',
  standalone: true,
  imports: [RouterLink, NavBarAdminComponent],
  templateUrl: './admin-screen.component.html',
  styleUrl: './admin-screen.component.scss',
})
export class AdminScreenComponent implements OnInit {
  userData: any;

  constructor(private routes: ActivatedRoute) {}

  ngOnInit() {
    // Obtener los datos de la ruta
    this.routes.params.subscribe((params) => {
      this.userData = params['data'];
    });
    console.log('Datos del usuario: ', this.userData);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { NavBarAdminComponent } from '../../admin-screen/navBar-admin/nav-bar-admin/nav-bar-admin.component';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [RouterLink, NavBarComponent, NavBarAdminComponent],
  templateUrl: './career.component.html',
  styleUrl: './career.component.scss',
})
export class CareerComponent implements OnInit {
  showBackBTNHome: boolean = false;
  showBackBTNAdmin: boolean = false;
  
  constructor(private router: Router) { }
  
  ngOnInit(): void {
    let currentUrl = this.router.url.split('?')[0]; // Obtener la URL base sin los parámetros de consulta
    console.log('Ruta actual: ', currentUrl);

    // Verificar si la URL comienza con una ruta específica
    if (currentUrl.startsWith('/rules_admin')) {
      this.showBackBTNHome = false;
      this.showBackBTNAdmin = true;
    } else if (currentUrl.startsWith('/rules')) {
      this.showBackBTNHome = true;
      this.showBackBTNAdmin = false;
    }
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { NavBarAdminComponent } from '../../admin-screen/navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { ChangeDetectorRef } from '@angular/core';

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
  from: string = ''; // Guardará si viene desde el admin o el usuario

  constructor(private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Obtener el parámetro "from" de la URL para saber desde dónde accedió
    this.route.queryParams.subscribe(params => {
      this.from = params['from'] || 'user'; // Valor por defecto: 'user'
    });

    // Cambiar los botones según el valor de "from"
    if (this.from === 'admin') {
      this.showBackBTNHome = false;
      this.showBackBTNAdmin = true;
    } else if (this.from === 'user') {
      this.showBackBTNHome = true;
      this.showBackBTNAdmin = false;
    }

    // Forzar detección de cambios
    this.cdr.detectChanges();
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

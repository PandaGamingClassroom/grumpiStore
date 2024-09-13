import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { NavBarAdminComponent } from '../../admin-screen/navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { RouterModule } from '@angular/router'; // Asegúrate de importar RouterModule

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [NavBarComponent, NavBarAdminComponent, RouterModule], // Importa RouterModule aquí
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss'],
})
export class CareerComponent implements OnInit {
  showBackBTNHome: boolean = false;
  showBackBTNAdmin: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Suscribirse a los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      const from = params['from'];
      console.log('Parámetro "from":', from);

      if (from === 'admin') {
        this.showBackBTNHome = false;
        this.showBackBTNAdmin = true;
      } else if (from === 'user') {
        this.showBackBTNHome = true;
        this.showBackBTNAdmin = false;
      } else {
        // Por defecto, se asume que es un usuario si no se pasa el parámetro
        this.showBackBTNHome = true;
        this.showBackBTNAdmin = false;
      }
      
      // Detectar cambios para que Angular actualice la vista
      this.cdr.detectChanges();
    });
  }

  // Deshabilitar clic derecho (si es necesario)
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

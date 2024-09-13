import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { NavBarAdminComponent } from '../../admin-screen/navBar-admin/nav-bar-admin/nav-bar-admin.component';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [RouterLink, NavBarComponent, NavBarAdminComponent],
  templateUrl: './career.component.html',
  styleUrl: './career.component.scss',
})
export class CareerComponent implements OnInit{
  hideElements: boolean = false;
  showBackBTNHome: boolean = false;
  showBackBTNAdmin: boolean = false;
  isClicked: boolean = false;
  
  constructor(private route: ActivatedRoute, private router: Router) { }
  
  ngOnInit(): void {
    let currentUrl = this.router.url.split('?')[0].replace(/\/$/, ''); // Remover cualquier '/' al final
  
    /**
     *
     * Se comprueba desde donde se accede a este componente
     * para cambiar el botón que vuelve atrás.
     *
     */
    console.log('Ruta actual: ', currentUrl);
    if (currentUrl === '/rules_admin') {
      this.showBackBTNHome = false;
      this.showBackBTNAdmin = true;
    } else if (currentUrl === '/rules') {
      this.showBackBTNHome = true;
      this.showBackBTNAdmin = false;
    }
  }
  
  

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

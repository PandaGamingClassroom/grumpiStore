import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
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
    const currentUrl = this.router.url.split('?')[0]; 
    /**
     *
     * Se comprueba desde donde se accede a este componente
     * para cambiar el botón que vuelve atrás.
     *
     */
    console.log('Ruta actual: ', currentUrl);
    if (currentUrl === '/rules_admin/career_admin') {
      this.showBackBTNHome = false;
      this.showBackBTNAdmin = true;
    } else if (currentUrl === '/rules/career') {
      this.showBackBTNHome = true;
      this.showBackBTNAdmin = false;
    }
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
  Router
} from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rules',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss',
})
export class RulesComponent implements OnInit {
  hideElements: boolean = false;
  showBackBTNHome: boolean = false;
  showBackBTNAdmin: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los parámetros de consulta
    this.route.queryParams.subscribe((params) => {
      this.hideElements = params['hideElements'] === 'true';
    });

    const currentUrl = this.router.url;

    /**
     *
     * Se comprueba desde donde se accede a este componente
     * para cambiar el botón que vuelve atrás.
     *
     */
    if (currentUrl === '/rules?hideElements=true') {
      this.showBackBTNHome = false;
      this.showBackBTNAdmin = true;
    } else if (currentUrl === '/rules') {
      this.showBackBTNHome = true;
      this.showBackBTNAdmin = false;
    }
  }
}

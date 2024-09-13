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

  constructor(private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Leer los parámetros de la URL
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
        this.showBackBTNHome = true;
        this.showBackBTNAdmin = false;
      }
    });
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

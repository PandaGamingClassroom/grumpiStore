import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  
  constructor(private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    let currentUrl = this.router.url.split('?')[0];
    console.log('Ruta actual: ', currentUrl);

    if (currentUrl.startsWith('/rules_admin')) {
      this.showBackBTNHome = false;
      this.showBackBTNAdmin = true;
    } else if (currentUrl.startsWith('/rules')) {
      this.showBackBTNHome = true;
      this.showBackBTNAdmin = false;
    }
    this.cdr.detectChanges();
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}

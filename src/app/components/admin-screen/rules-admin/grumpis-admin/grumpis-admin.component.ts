import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GrumpiService } from '../../../services/grumpi/grumpi.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';

@Component({
  selector: 'app-grumpis-admin',
  standalone: true,
  imports: [
    RouterLink,
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NavBarAdminComponent
  ],
  providers: [GrumpiService],
  templateUrl: './grumpis-admin.component.html',
  styleUrl: './grumpis-admin.component.scss',
})
export class GrumpisAdminComponent implements OnInit {
  grumpi_list: any[] = [];
  isClicked: boolean = false;
  @ViewChild('scrollTarget') scrollTarget: ElementRef | undefined;

  constructor(private grumpiService: GrumpiService) {}

  ngOnInit(): void {
    this.loadImageUrls();
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  loadImageUrls() {
    this.grumpiService.getGrumpis().subscribe(
      (response) => {
        this.grumpi_list = response.grumpis_list;
      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
  }

  handleClick(): void {
    this.isClicked = !this.isClicked;
  }

  scrollToTop(): void {
    if (this.scrollTarget) {
      this.scrollTarget.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }
}

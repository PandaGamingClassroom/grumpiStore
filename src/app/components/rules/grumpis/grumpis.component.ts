import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { GrumpiService } from '../../services/grumpi/grumpi.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-grumpis',
  standalone: true,
  imports: [
    RouterLink,
    NavBarComponent,
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [GrumpiService],
  templateUrl: './grumpis.component.html',
  styleUrl: './grumpis.component.scss',
})
export class GrumpisComponent implements OnInit {
  imageUrls: string[] = [];
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
    this.grumpiService.getImageUrls().subscribe(
      (response) => {
        this.imageUrls = response.imageUrls;

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

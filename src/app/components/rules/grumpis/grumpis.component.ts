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
  grumpi_list: any[] = [];
  grumpi_event_list: any[] = [];
  grumpi_legend_list: any[] = [];
  isClicked: boolean = false;
  eventIsClicked: boolean = false;
  legendariosIsClicked: boolean = false;

  @ViewChild('scrollTarget') scrollTarget: ElementRef | undefined;

  constructor(private grumpiService: GrumpiService) {}

  ngOnInit(): void {
    this.getGrumpis();
    // Filtrar la lista de Grumpis con clase 'evento'
    this.grumpi_event_list = this.grumpi_list.filter(
      (grumpi) => grumpi.clase === 'evento'
    );
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  getGrumpis() {
    this.grumpiService.getGrumpis().subscribe(
      (response) => {
        console.log('Listado de Grumpis: ', response.grumpis_list);
        this.grumpi_list = response.grumpis_list;
      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
  }

  toggleGrumpis() {
    this.isClicked = !this.isClicked;
  }

  toggleEventos() {
    this.eventIsClicked = !this.eventIsClicked;
  }

  toggleLegendarios() {
    this.legendariosIsClicked = !this.legendariosIsClicked;
  }

  scrollToTop(): void {
    if (this.scrollTarget) {
      this.scrollTarget.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }
}

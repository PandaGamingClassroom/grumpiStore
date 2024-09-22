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
  legendIsClicked: boolean = false;

  @ViewChild('scrollTarget') scrollTarget: ElementRef | undefined;

  constructor(private grumpiService: GrumpiService) {}

  ngOnInit(): void {
    this.getGrumpis();
  }

  /**
   * Función para deshabilitar los clicks del ratón en las imágenes
   * @param event
   */
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  /**
   * Función para obtener el listado completo de Grumpis
   */
  getGrumpis() {
    this.grumpiService.getGrumpis().subscribe(
      (response) => {
        this.grumpi_list = response.grumpis_list;
        this.grumpi_event_list = this.grumpi_list.filter(
          (grumpi) => grumpi.clase === 'evento'
        );
        this.grumpi_legend_list = this.grumpi_list.filter(
          (grumpi) => grumpi.clase === 'legendario'
        );
      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
  }

  /**
   * Función para mostrar u ocultar la lista general de Grumpis
   */
  handleClick(): void {
    this.isClicked = !this.isClicked;
  }

  /**
   * Función para mostrar u ocultar la lista de Grumpis de evento
   */
  toggleEventos(): void {
    this.eventIsClicked = !this.eventIsClicked;
  }

  /**
   * Función para mostrar u ocultar la lista de Grumpis legendarios
   */
  legendClick() {
    this.legendIsClicked = !this.legendIsClicked;
  }

  /**
   * Función para hacer que vuelva a un punto de la pantalla
   */
  scrollToTop(): void {
    if (this.scrollTarget) {
      this.scrollTarget.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }
}

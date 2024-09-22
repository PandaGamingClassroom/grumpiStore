import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GrumpiService } from '../../../services/grumpi/grumpi.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { ViewImageComponent } from '../../../../segments/view-image/view-image.component';
import { MatDialog } from '@angular/material/dialog';

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
    NavBarAdminComponent,
  ],
  providers: [GrumpiService],
  templateUrl: './grumpis-admin.component.html',
  styleUrl: './grumpis-admin.component.scss',
})
export class GrumpisAdminComponent implements OnInit {
  grumpi_list: any[] = [];
  grumpi_event_list: any[] = [];
  grumpi_legend_list: any[] = [];
  isClicked: boolean = false;
  eventIsClicked: boolean = false;
  legendIsClicked: boolean = false;

  searchTerm: string = '';
  @ViewChild('scrollTarget') scrollTarget: ElementRef | undefined;

  constructor(
    private grumpiService: GrumpiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getGrumpis();
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

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

  get filteredCreaturesImages(): any[] {
    return this.grumpi_list.filter((imageUrl) =>
      imageUrl.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

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

  scrollToTop(): void {
    if (this.scrollTarget) {
      this.scrollTarget.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }

  openGrumpi(creature: any) {
    const dialogRef = this.dialog.open(ViewImageComponent, {
      width: '700px',
      height: '600px',
      data: creature,
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}

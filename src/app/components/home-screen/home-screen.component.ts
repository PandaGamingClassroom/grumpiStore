import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { BienvenidaModalComponent } from '../../segments/bienvenida-modal/bienvenida-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [
    RouterLink,
    NavBarComponent,
    FooterComponent,
    BienvenidaModalComponent
  ],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss',
})
export class HomeScreenComponent implements OnInit {
  constructor(private dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.checkAndShowWelcomeDialog();
  }

  /**
   * Función para verificar si ya se mostró el mensaje de bienvenida,
   * y mostrarlo si es la primera vez en la sesión.
   */
  checkAndShowWelcomeDialog() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const welcomeShown = sessionStorage.getItem('welcomeShown');
      if (!welcomeShown) {
        this.openWelcomeDialog();
        sessionStorage.setItem('welcomeShown', 'true');
      }

    }
  }

  /**
   * Función para mostrar un mensaje de bienvenida cuando
   * el usuario se ha conectado.
   */
  openWelcomeDialog() {
    this.dialog.open(BienvenidaModalComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      autoFocus: true,
      data: {},
    });
  }

  abrirLink(url: string) {
    window.open(url, '_blank');
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}

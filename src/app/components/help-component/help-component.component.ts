import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FooterComponent } from '../footer/footer.component';
import { ViewImageComponent } from '../../segments/view-image/view-image.component';

@Component({
  selector: 'app-help-component',
  standalone: true,
  imports: [RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './help-component.component.html',
  styleUrl: './help-component.component.scss',
})
export class HelpComponentComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
  openImageWindow(selectedObject: string) {
    let urlImage: string;
    let titleImage: string;
    if (selectedObject === 'TiposEnergia') {
      urlImage = '../../../assets/carteleria/tiposEnergia.png';
      titleImage = 'Tipos de energía';
    } else if (selectedObject === 'ConseguirEnergias') {
      urlImage = '../../../assets/carteleria/comoConseguirEnergia.png';
      titleImage = 'Como conseguir energías';
    } else if (selectedObject === 'Recompnensas') {
      urlImage = '../../../assets/carteleria/recompensa.png';
      titleImage = 'Recompnensas';
    } else if (selectedObject === 'Grumpimonedas') {
      urlImage = '../../../assets/carteleria/grumpimonedasMusica.pngg';
      titleImage = 'Grumpimonedas Música';
    } else if (selectedObject === 'GrumpimonedasEF') {
      urlImage = '../../../assets/carteleria/grumpimonedasEF.png';
      titleImage = 'Grumpimonedas EF';
    } else if (selectedObject === 'instrucciones') {
      urlImage =
        '../../../assets/carteleria/Instrucciones de carta Grumpi.1.png.png';
      titleImage = 'Instrucciones';
    } else if (selectedObject === 'estadosAlterados') {
      urlImage = '../../../assets/carteleria/estados_alterados.jpg';
      titleImage = 'Estados alterados';
    } else if (selectedObject === 'objCombate') {
      urlImage = '../../../assets/carteleria/objCombate.png';
      titleImage = 'Objetos de combate';
    } else if (selectedObject === 'tienda') {
      urlImage = '../../../assets/carteleria/TIENDA_GRUMPI.png.png';
      titleImage = 'Tienda Grumpi';
    } else if (selectedObject === 'tiendaObjCombate') {
      urlImage = '../../../assets/carteleria/TIENDA_OBJETOSCOMBATE.png.png';
      titleImage = 'Tienda Objetos de combate';
    } else {
      console.warn('Objeto no reconocido:', selectedObject);
      return;
    }

    const data = {
      title: titleImage,
      message: urlImage,
    };

    this.dialog.open(ViewImageComponent, {
      width: '600px',
      height: '520px',
      data: data,
    });
  }
}

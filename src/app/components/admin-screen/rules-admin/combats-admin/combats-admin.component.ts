import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { ViewImageComponent } from '../../../../segments/view-image/view-image.component';
@Component({
  selector: 'app-combats-admin',
  standalone: true,
  imports: [RouterLink, NavBarAdminComponent],
  templateUrl: './combats-admin.component.html',
  styleUrl: './combats-admin.component.scss',
})
export class CombatsAdminComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  openImageWindow(selectedObject: string) {
    let urlImage: string;
    let titleImage: string;
    if (selectedObject === 'desfibrilador') {
      urlImage = '../../../../assets/objects/Desfibrilador.1.png';
      titleImage = 'Desfibrilador';
    } else if (selectedObject === 'despertador') {
      urlImage = '../../../../assets/objects/Despertador.1.png';
      titleImage = 'Despertador';
    } else if (selectedObject === 'gafas de sol') {
      urlImage = '../../../../assets/objects/Gafas_de_sol.1.png';
      titleImage = 'Gafas de sol';
    } else if (selectedObject === 'extintor') {
      urlImage = '../../../../assets/objects/Extintor.1.png';
      titleImage = 'Extintor';
    } else if (selectedObject === 'antidoto') {
      urlImage = '../../../../assets/objects/Antidoto.1.png';
      titleImage = 'Antídoto';
    } else if (selectedObject === 'pocion') {
      urlImage = '../../../../assets/objects/Pocion.1.png';
      titleImage = 'Poción';
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
